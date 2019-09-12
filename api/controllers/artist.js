'use strict'

var mongoosePaginate= require('mongoose-pagination');

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
  var artistId = req.params.id;

  Artist.findById(artistId, (err, artist) => {
    if (err) {
      res.status(500).send({ message: 'Error en la peticion'});
    }

    if(!artist){
      res.status(404).send({ message: 'El artista no existe'});
    } else {
      res.status(200).send({ artist: artist});
    }
});
}

function saveArtist(req, res) {
  var artist = new Artist();

  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save( (err, artistStored) => {
    if (err) {
      res.status(500).send({ message: 'Error al guardar el artista'});
    };

    if (!artistStored){
      res.status(404).send({ message: 'Artista no guardado'});
    }else {
      res.status(200).send({ artist: artistStored});
    }
  })
}

function getArtists(req, res) {

  if(req.params.page){
   var page = req.params.page;
 }else{
   var page = 1;
 }
   var itemsPerPage = 2;

   Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
     if(err) {
       res.status(500).send( {message: 'error en la peticion'});
     }

     if(!artists) {
       res.status(404).send( {message: 'no hay artistas'});
     } else {
       return res.status(200).send( {
         totalItems: total,
         artists: artists
       })
     }
   });
}

function updateArtist(req, res) {
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
    if(err) {
      return res.status(500).send( {message: 'error al actualizar artista'});
    }

    if(!artistUpdated) {
      return res.status(404).send( {message: 'el artista no se actualizó'});
    } else{
      return res.status(200).send( {artist: artistUpdated} );
    }
  });
}

function deleteArtist(req, res) {
  var artistId = req.params.id;

  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if(err) {
      return res.status(500).send( {message: 'error al eliminar artista'});
    }
    if(!artistRemoved){
      return res.status(404).send( {message: 'el artista no se elimino'});
    }else {
      // borrar albums
      Album.find( {artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
              res.status(200).send( {artist: artistRemoved} );
            };
          });
        };
     });
   };
 });
}

function uploadImage(req, res){

  var artistId = req.params.id;
  var file_name = 'no subido';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
      if(!artistUpdated){
        res.status(404).send({message: 'No se ha podido actualizar'})
    }else{
      res.status(200).send({artist: artistUpdated})
    }
    })

    console.log(file_path);

  } else {
    res.status(200).send( { message: 'No se subió ninguna imagen'})
  }
  }

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/artists/' + imageFile;

  fs.exists(path_file, (exists) => {
    if(exists){
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send( {message: 'No existe la imagen'});
    }
  })
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
}
