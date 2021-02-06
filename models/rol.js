const mongo = require('mongoose');

const rolSchema = new mongo.Schema({
  Name: {
    type: String,
    required: 'Nombre requerido'
  },
  Description: String,
  CreateAt: {
    type: Date,
    default: Date.now
  },
  Enabled: {
    type: Boolean,
    default: true
  }
});

const Rol = mongo.model('rol', rolSchema);

module.exports = Rol;

module.exports.rolSchema = rolSchema;