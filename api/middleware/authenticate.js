'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

//parametros del htto en req, next para salir del middleware
exports.ensureAuth = function(req, res, next){
  if(!req.headers.authorization){
    return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
  }

  var token = req.headers.authorization.replace(/['"]+/g, '');

  try {
    var payload = jwt.decode(token, secret);
//fecha exp < fecha actual
    if(payload.exp >= moment.unix()){
      return res.status(401).send({message: 'El token ha expirado'});
    }

  } catch (e) {
      console.log(e);
      return res.status(404).send({message: 'Token no válido'});
  }

  req.user = payload;
  next();
};
