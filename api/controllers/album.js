'use strict'

var mongoosePaginate= require('mongoose-pagination');

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
  var albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
    if (err) {
      res.status(500).send({ message: 'Error en la peticion'});
    }

    if(!album){
      res.status(404).send({ message: 'El album no existe'});
    } else {
      res.status(200).send({ album: album});
    }
});
}

function saveAlbum(req, res) {

var album = new Album();

var params = req.body;
album.title = params.title;
album.description = params.description;
album.year = params.year;
album.image = 'null';
album.artist = params.artist;

album.save( (err, albumSaved) => {
    if(err){
      res.status(500).send( { message: 'Error al guardar el album'});
    }

    if(!albumSaved) {
      res.status(404).send({message: 'No se guardo el album'});
    } else {
      res.status(200).send({album: albumSaved});
    }
  })

}

function getAlbums(req, res){

  var artistId = req.params.artist;

  if(!artistId){
  //muestro todos los albums de la DB
  var find = Album.find().sort('title');
  }else{
  //saco los del artista concreto
  var find = Album.find({artist: artistId}).sort('year');
  }

  find.populate({path: 'artist'}).exec((err, albums) => {
   if(err){
      res.status(500).send( {message: 'error en la peticion'});
   };

   if(!albums){
     res.status(404).send( {message: 'no hay albums'});
   }else{
     return res.status(200).send( {albums: albums})
   }
  })
}

function updateAlbum(req, res) {
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if(err) {
      return res.status(500).send( {message: 'error al actualizar album'});
    }

    if(!albumUpdated) {
      return res.status(404).send( {message: 'el album no se actualizó'});
    } else{
      return res.status(200).send( {artist: albumUpdated} );
    }
  });
}

// Delete album and songs
function deleteAlbum(req, res) {

  var albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    if(err) {
      return res.status(500).send( {message: 'error al eliminar el album '});        }
    if(!albumRemoved){
      return res.status(404).send( {message: 'el album no se elimino'});
    } else {
      // borrar canciones
      Song.find( {album: albumRemoved._id}).remove((err, SongRemoved) => {
        if(err) {
          return res.status(500).send( {message: 'error al eliminar la cancion '});
        }
        if(!SongRemoved){
          return res.status(404).send( {message: 'la cancion no se elimino'});
        }else {
          res.status(200).send( {album: albumRemoved} );
        };
      });
    };
});
}


function uploadImage(req, res){

  var albumId = req.params.id;
  var file_name = 'no subido';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
      if(!albumUpdated){
        res.status(404).send({message: 'No se ha podido actualizar'})
    }else{
      res.status(200).send({album: albumUpdated})
    }
    })

    console.log(file_path);

  } else {
    res.status(200).send( { message: 'No se subió ninguna imagen'})
  }
  }

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;

  var path_file = './uploads/albums/' + imageFile;

  fs.exists(path_file, (exists) => {
    if(exists){
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send( {message: 'No existe la imagen'});
    }
  })
}

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
}
