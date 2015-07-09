var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
//                                        protocol   user   pass  host  port dbname
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var protocol = (url[1] || null);
var user = (url[2] || null);
var pass = (url[3] || null);
var host = (url[4] || null);
var port = (url[5] || null);
var dbname = (url[6] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(dbname, user, pass,
                      { dialect: protocol,
                        protocol: protocol,
                        port: port,
                        host: host,
                        storage: storage,
                        omitNull: true});

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definicion de la tabla Comment en comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;        // exportar definicion de tabla Quiz
exports.Comment = Comment;  // exportar definicion de tabla Comment

// sequelize.sync() create e inicializa tabla de preguntas en DB
sequelize.sync().success(function() {
  // success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().success(function(count) {
    if ( count === 0 ) {  // la tabla se inicializa solo si esta vacia
      Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma', categoria:"humanidades"});
      Quiz.create({pregunta: 'Capital de Portugal', respuesta: 'Lisboa', categoria:"humanidades"})
      .then(function() { console.log('Base de datos inicializada'); });
    }
  });
});
