const express = require('express');
const router = express.Router();

const user = require('../controllers/user');

router.post('/signup', user.signup);
router.post('/login', user.login);
router.get('/login', user.login_page);
router.get('/logout', user.logout);
router.get('/signup', user.signup_page)
module.exports = router;