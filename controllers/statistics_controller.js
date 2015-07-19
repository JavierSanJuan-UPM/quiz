var models = require('../models/models.js');

exports.statistics = function(req, res, next) {
  // Busca todas las preguntas
  models.Quiz.findAll({ include: [{model: models.Comment}] })
  .then(function(quizes) {
    // Obtiene numero total de comentarios
    var numComments = 0;
    var averageComments = 0;
    var numQuestionsWithComments = 0;
    var numQuestionsWithoutComments = 0;
    for ( var i = 0; i < quizes.length; i++ ) {
      numComments += quizes[i].comments.length;
      if ( !quizes[i].comments || quizes[i].comments.length === 0 ) {
        numQuestionsWithoutComments++;
      } else {
        numQuestionsWithComments++;
      }
    }
    averageComments = numComments / quizes.length;

    res.render('statistics', {
      quizes: quizes,
      numComments: numComments,
      averageComments: averageComments,
      numQuestionsWithComments: numQuestionsWithComments,
      numQuestionsWithoutComments: numQuestionsWithoutComments,
      errors: [] });
  }).catch(function(error) { next(error); });
};
