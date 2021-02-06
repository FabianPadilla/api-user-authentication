const express = require('express');
const router = express.Router();
const Rol = require('../models/rol');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const roles = await Rol.find();
  res.status(200).send(roles);
});

router.get('/:id', auth, async (req, res) => {
  const rol = await Rol.findById(req.params.id);
  if(!rol) return res.status(404).send('No hemos encontrado un rol con ese ID');

  res.status(200).send(rol);
});

router.post('/', auth, async (req, res) => {
  try{
    rol = new Rol({
      Name: req.body.Name,
      Description: req.body.Description,
      Enabled: req.body.Enabled,
    });

    const result = await rol.save();

    res.status(201).send(result);
  }catch(err){
    return res.status(422).send({error: err.message});
  }
});

router.put('/:id', auth, async (req, res) => {
  try{
    let update = {
      Name: req.body.Name,
      Description: req.body.Description,
      Enabled: req.body.Enabled,
    };

    for (let key in update) {
      if(update[key] == null || update[key] == undefined) delete update[key];
    }
    if(Object.keys(update).length === 0) res.status(400).send('No se encontraron valores para actualizar');

    const rol = await Rol.findByIdAndUpdate(req.params.id, update);
    if(!rol){
      res.status(404).send('El id del rol no se encontró')
    }
  }catch(err){
    res.status(500).send(err.message);
  }
  res.status(200).send('Rol actualizado correctamente');
});

router.delete('/:id', auth, async (req, res) => {
  try{
    const rol = await Rol.findByIdAndDelete(req.params.id);
  }catch(err){
    res.status(404).send('El id del rol no se encontró');
  }

  res.status(200).send('Rol eliminado');
});

module.exports = router;

