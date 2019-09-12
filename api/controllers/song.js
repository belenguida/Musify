'use strict'

var mongoosePaginate= require('mongoose-pagination');

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){

  var songId = req.params.id;

  Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
    if(err){
      res.status(500).send({message: 'error'});
    }

    if(song){
      res.status(200).send({song});
    }else{
      res.status(400).send({message: 'no existe la cancion'});
    }
  })

}

function saveSong(req, res){
  var song = new Song();

  var params = req.body;
  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = null;
  song.album = params.album;

  song.save((err, songStored) => {
    if(err){
      res.status(500).send({message: 'Error'});
    }

    if(songStored){
      res.status(200).send({song: songStored});
    }else{
      res.status(404).send({message: 'No se guardo la cancion'});
    }
  })
}

function getSongs(req, res){

  var albumId = req.params.album;

  if(albumId){
    var find = Song.find({album : albumId}).sort('number');
  }else {
    var find = Song.find({}).sort('number');
  }

  find.populate({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'Artist'}
  }).exec((err, songs) => {
    if(err){
     res.status(500).send({message: 'Error'});
    }

    if(songs){
      res.status(200).send({songs});
    }else {
      res.status(404).send({message: 'No hay canciones'});
    }
  });
}

function updateSong(req, res){

  var songId = req.params.id;
  var update = req.body;

  Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
    if(err){
       res.status(500).send({message: 'Error'});
    }
    if(songUpdated){
      res.status(200).send({songUpdated});
    }else {
      res.status(404).send({message: 'No se ha actualizado la cancion'});
    }

  })
}

function deleteSong(req, res) {

  var songId = req.params.id;
  Song.findByIdAndRemove(songId, (err, songStored) =>{
    if(err){
       res.status(500).send({message: 'Error'});
    }
    if(songStored){
      res.status(200).send({songStored});
    }else {
      res.status(404).send({message: 'No se ha borrado la cancion'});
    }
  })

}

function uploadFile(req, res){

  var songId = req.params.id;
  var file_name = 'no subido';

  if (req.files) {
    var file_path = req.files.file.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
      if(!songUpdated){
        res.status(404).send({message: 'No se ha podido actualizar'})
    }else{
      res.status(200).send({song: songUpdated})
    }
    })

    console.log(file_path);

  } else {
    res.status(200).send( { message: 'No se subió ninguna cancion'})
  }
  }

function getFile(req, res) {
  var songFile = req.params.id;

  var path_file = './uploads/songs/' + songFile;

  fs.exists(path_file, (exists) => {
    if(exists){
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send( {message: 'No existe la cancion'});
    }
  })
}


module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getFile
}
