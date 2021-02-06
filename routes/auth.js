const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/', async (req, res)=>{
  try{
    let user = await User.findOne({Email: req.body.Email});
    if(!user) return res.status(400).send('usuario o contraseña incorrectos');

    const validPassword = await bcrypt.compare(req.body.Password, user.Password);
    if(!validPassword) return res.status(400).send('usuario o contraseña incorrectos');

    const jwt = user.generateJWT();

    res.status(201).header('Authorization', jwt).send({
      id: user._id,
      FirsName: user.FirsName,
      Email: user.Email,
    });
    
  }catch(err){
    res.status(500).send({error: err.message});
  }
});

router.post('/signup', async (req, res) => {
  try{
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.Password, salt);

    user = new User({
      FirsName: req.body.FirsName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Password: hashPassword,
      Rol: '600f49f06ba5c85a2cc85e66',
    });
    const result = await user.save();

    const jwt = user.generateJWT()

    res.status(201).header( 'Authorization' , jwt).send({
      id: user.id,
      FirsName: user.FirsName,
      LastName: user.LastName,
      Email: user.Email,
      Rol: user.Rol,
      Enabled: user.Enabled
    });

  }catch(err){
    console.log(err);
    return res.status(422).send({error: err.message});
  }
});

module.exports = router;