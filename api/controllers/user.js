'use strict'

var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function pruebas(req, res){
  res.status(200).send({
    message: 'Probando una acción del controlador de usuarios del api rest'
  });
}

function saveUser(req, res) {
  var user = new User();

  var params = req.body; //cuerpo de la peticion - datos que llegan por post

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = 'ROLE_ADMIN';
  user.image = 'null';

  // encriptar contraseña
  if(params.password){
    bcrypt.hash(params.password, null, null, function (err,hash) {
      user.password = hash;

      if(user.name != null && user.surname != null && user.email != null){
        //guardar
        user.save((err, userStored) => {
          if(err){
            res.status(500).send({message: 'Error al guardar'});
          }else{
            res.status(200).send({user: userStored});
          }
        });
      }else{
        res.status(200).send({message: 'Introduce todos los campos'});
      }
    })
  }else{
    res.status(200).send({message: 'Introduce la contraseña'});
  }
}

function loginUser(req, res) {
  var params = req.body; //convertido a json

  var email = params.email;
  var password = params.password;

  User.findOne({email: email.toLowerCase()},(err, user) =>{
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!user){
        res.status(404).send({message: 'El user no existe'});
      }else {
        //comprobar contraseña
        bcrypt.compare(password, user.password, (err, check) =>{
          if(check){
              //devolver datos del user
              if(params.getHash){
                //devolver un token de jwr
                res.status(200).send({
                  token: jwt.createToken(user)
                })
              }else{
               res.status(200).send({user});
              }
          }else {
            res.status(404).send({message: 'Contraseña incorrecta'})
          }
        })
      }
    }
  });
}

function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body;

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if(err){
      res.status(500).send({message: 'Error al actualizar usuario'})
    }else{
      if(!userUpdated){
        res.status(404).send({message: 'No se ha podido actualizar'})
    }else{
      res.status(200).send({user: userUpdated})
    }
  }
});

}

/*
*/
function uploadImage(req, res) {
  var userId = req.params.id;
  var file_name = 'No subido';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
      if(!userUpdated){
        res.status(404).send({message: 'No se ha podido actualizar'})
    }else{
      res.status(200).send({image: file_path, user: userUpdated})
    }
    })

    console.log(file_path);

  } else {
    res.status(200).send( { message: 'No se subió ninguna imagen'})
  }
}

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/users/' + imageFile;

  fs.exists(path_file, (exists) => {
    if(exists){
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send( {message: 'No existe la imagen'});
    }
  })
}

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};
