const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const pageSize = 5;
  const pageNumber = parseInt(req.query.page);
  const users = await User.find().populate('Rol', 'Name Description').skip((pageNumber-1)*pageSize).limit(pageSize);
  User.countDocuments(function (err, count) {
    const total = count;
    const result = {
      total: total,
      users: users
    }
    res.send(result);
  });
});

router.get('/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id).populate('Rol', 'Name Description');
  if(!user) return res.status(404).send({status: 404, error: "Usuario no encontrado"})

  res.send(user)
});

router.post('/', auth, async (req, res) => {
  try{
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.Password, salt);

    user = new User({
      FirsName: req.body.FirsName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Password: hashPassword,
      Rol: req.body.Rol,
      Enabled: req.body.Enabled
    });
    const result = await user.save();

    res.status(201).send({
      status: 201,
      id: user.id,
      FirsName: user.FirsName,
      LastName: user.LastName,
      Email: user.Email,
      Rol: user.Rol,
      Enabled: user.Enabled
    });

  }catch(err){
    console.log(err);
    return res.status(422).send({status: 422, error: err.message});
  }
});

router.put('/:id', auth, async (req, res) => {
  try{
    let hashPassword = null;
    if(req.body.Password){
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(req.body.Password, salt);
    }

    let date = Date.now();
    let update = {
      FirsName: req.body.FirsName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Password: hashPassword,
      Rol: req.body.Rol,
      Enabled: req.body.Enabled
    };
    /*Object.keys(update).map((key) => {
      if(update[key] == null || update[key] == undefined) delete update[key];
    });*/
    for (let key in update) {
      if(update[key] == null || update[key] == undefined) delete update[key];
    }
    if(Object.keys(update).length === 0) res.status(400).send({status: 400, error: "Sin parametros"});

    update.UpdateAt = date;

    const user = await User.findByIdAndUpdate(req.params.id, update, {runValidators: true}); //run validations para la validacion del email

    if(!user){
      res.status(404).send({status: 404, error: "Usuario no encontrado"})
    }
  }catch(err){
    res.status(500).send({error: err.message});
  }
  res.status(200).send({
    status: 200
  });
});

router.delete('/:id', auth, async (req, res) => {
  try{
    const user = await User.findByIdAndDelete(req.params.id);
  }catch(err){
    res.status(404).send({status: 404, error: "Usuario no encontrado"});
  }

  res.status(200).send('Usuario eliminado');
});


module.exports = router;