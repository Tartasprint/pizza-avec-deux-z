const express = require('express');
const router = express.Router();
const editor = require('../controllers/editor')
const auth = require('../middleware/auth')
router.use(auth())
router.get('/edit/:docid', editor.edit)
router.get('/new', editor.new_form)
router.post('/new', editor.new)
router.get('/list', editor.list)

module.exports = router