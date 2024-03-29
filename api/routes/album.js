'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');

var api = express.Router();

// Restringir acceso a usuarios logueados
var md_auth = require('../middleware/authenticate');

var multipart = require('connect-multiparty');

// middleware para subir archivos
var md_upload = multipart( { uploadDir: './uploads/albums' });

api.get('/album/:id?', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album-update/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth,md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;
