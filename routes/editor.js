const express = require('express');
const router = express.Router();
const editor = require('../controllers/editor')

router.get('/edit/:docid', editor.edit)
router.get('/new',editor.new_form)
router.post('/new',editor.new)

module.exports=router