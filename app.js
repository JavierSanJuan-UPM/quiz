// Obtenemos middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');

// Creamos app Express
var app = express();

// Configuracion del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Activamos uso de middlewares
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

// Helpers dinamicos
app.use(function(req, res, next) {
  // Guardar path en session.redir para despues de login
  if ( !req.path.match(/\/login|\/logout/) ) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;

  next();
});

// Middleware de autologout
app.use(function(req, res, next) {
  if ( req.session.user ) {
    if ( req.session.timeout <= Date.now() ) {
      // Destruimos sesion
      delete req.session.user;
      delete req.session.timeout;
    } else {
      req.session.timeout = Date.now() + 120000;
    }
  }
  next();
});

// Activamos enrutador
app.use('/', routes);

// Capturamos errores 404 and y los redirigimos al gestor de errores
app.use(function(req, res, next) {
    var err = new Error('Ruta no encontrada: ' + req.url);
    err.status = 404;
    next(err);
});

// Gestores de errores

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
