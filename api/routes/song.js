'use strict'

var express = require('express');
var SongController = require('../controllers/song');

var api = express.Router();

// Restringir acceso a usuarios logueados
var md_auth = require('../middleware/authenticate');

var multipart = require('connect-multiparty');

// middleware para subir archivos
var md_upload = multipart( { uploadDir: './uploads/songs' });

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-song/:id', [md_auth.ensureAuth,md_upload], SongController.uploadFile);
api.get('/get-song/:id', SongController.getFile);

module.exports = api;
