var express = require('express');
var router = express.Router();

// define the home page route
router.use('/',express.static('static'))
router.use('/bootstrap',express.static('node_modules/bootstrap/dist'))
router.use('/markdown-it',express.static('node_modules/markdown-it/dist'))
router.use('/editorjs/editor.js',express.static('node_modules/@editorjs/editorjs/dist/editor.js'))
router.use('/editorjs/header.js',express.static('node_modules/@editorjs/header/dist/bundle.js'))

module.exports = router;

