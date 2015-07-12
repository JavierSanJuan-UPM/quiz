var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
  res.render('comments/new.ejs', { quizid: req.params.quizId, errors: [] });
};

// POST: /quizes/:quizId/comments
exports.create = function(req, res) {
  var comment = models.Comment.build(
    {
      texto: req.body.comment.texto,
      QuizId: req.params.quizId
    }
  );

  var err = comment.validate();
  if ( err ) {
    var i = 0;
    var errors = [];
    for ( var p in err ) errors[i++] = { message: err[p] };
    res.render('comments/new.ejs',
      {
        comment: comment,
        quizid: req.params.quizId,
        errors: errors
      });
  } else {
    comment
    .save()
    .then(function() {
      res.redirect('/quizes/' + req.params.quizId);  // Redireccion HTTP a lista de preguntas
    });
  }
};
