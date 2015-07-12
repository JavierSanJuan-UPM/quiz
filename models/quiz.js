// Definicion del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Quiz',
    {
      pregunta:
      {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "-> Falta pregunta" } }
      },
      respuesta:
      {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "-> Falta respuesta" } }
      },
      categoria:
      {
        type: DataTypes.STRING,
        validate: { isIn: {
          args: [["otro", "humanidades", "ocio", "ciencia", "tecnologia"]],
          msg: "-> Categoría incorrecta"
        } }
      }
    });
}
