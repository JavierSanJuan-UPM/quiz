var models = require('../models/models.js');

// Autoload - factoriza el codigo si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if ( quiz ) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error) { next(error); });
};

// GET /quizes/index
exports.index = function(req, res, next) {
  // define filtro de busqueda
  var filtro = undefined;
  if ( typeof req.query.search !== 'undefined') {
    var search = '%' + req.query.search.replace(' ', '%') + '%';
    filtro = {  where: ['pregunta LIKE ?', search],
                order: 'pregunta ASC'};
  }

  // busca elementos segun filtro
  models.Quiz.findAll(filtro)
  .then(function(quizes) { res.render('quizes/index', { quizes: quizes }); })
  .catch(function(error) { next(error); });
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    { pregunta: "Pregunta",
      respuesta: "Respuesta"
    }
  );

  res.render('quizes/new', { quiz: quiz });
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  console.log(quiz.pregunta);
  console.log(quiz.respuesta);

  // guarda en DB los campos pregunta y respuesta de quiz
  if ( quiz.pregunta !== "" && quiz.respuesta !== "" ) {
    quiz.save({fields: ["pregunta", "respuesta"]})
    .then(function() {
      res.redirect('/quizes');  // Redireccion HTTP a lista de preguntas
    });
  } else {
    res.redirect('/quizes/new');
  }
};

// GET /quizes/:quizId
exports.show = function(req, res) {
  res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if ( req.query.respuesta === req.quiz.respuesta ) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz:req.quiz, respuesta: resultado});
};

// GET /author
exports.author = function(req, res) {
  res.render('author');
}
