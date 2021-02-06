const mongo = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongo.Schema({
  FirsName: {
    type: String,
    required: 'FirstName required'
  },
  LastName: String,
  Email: {
    type: String,
    required: [true, 'Email required'],
    trim: true,
    lowercase: true,
    unique: [true, 'el Email ya se encuentra registrado'],
    match: [/.+\@.+\..+/, 'Por favor ingrese un correo válido']
  },
  Password: {
    type: String,
    required: [true, 'Password required'],
  },
  Rol: {
    type: mongo.Schema.Types.ObjectId,
    ref: 'rol',
    required: [true, 'Rol required'],
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  },
  UpdateAt: Date,
  Enabled: {
    type: Boolean,
    default: true
  },
});

userSchema.methods.generateJWT = function(){
  return jwt.sign({id: this._id, firsName: this.FirsName, rolId: this.Rol}, process.env.SECRET_KEY_JWT_CAT_API);
}

const User = mongo.model('user', userSchema);

module.exports = User;