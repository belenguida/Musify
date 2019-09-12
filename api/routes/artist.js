'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');

var api = express.Router();

// Restringir acceso a usuarios logueados
var md_auth = require('../middleware/authenticate');

var multipart = require('connect-multiparty');

// middleware para subir archivos
var md_upload = multipart( { uploadDir: './uploads/artists' });

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/artist-update/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist-delete/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth,md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;
