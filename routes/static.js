var express = require('express');
var router = express.Router();

// define the home page route
router.use('/',express.static('static'))
router.use('/bootstrap',express.static('node_modules/bootstrap/dist'))
router.use('/popper',express.static('node_modules/@popperjs/core/dist'))
router.use('/jquery',express.static('node_modules/jquery/dist'))
router.use('/markdown-it',express.static('node_modules/markdown-it/dist'))
router.use('/editorjs/editor.js',express.static('node_modules/@editorjs/editorjs/dist/editor.js'))
router.use('/editorjs/header.js',express.static('node_modules/@editorjs/header/dist/bundle.js'))
router.use('/editorjs/marker.js',express.static('node_modules/@editorjs/marker/dist/bundle.js'))
router.use('/editorjs/paragraph.js',express.static('node_modules/@editorjs/paragraph/dist/bundle.js'))
router.use('/editorjs/underline.js',express.static('node_modules/@editorjs/underline/dist/bundle.js'))
router.use('/editorjs/inline-code.js',express.static('node_modules/@editorjs/inline-code/dist/bundle.js'))
router.use('/hexnut/client',express.static('node_modules/hexnut-client/src'))

module.exports = router;

