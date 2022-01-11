import express from 'express';
const router = express.Router();

import * as user from '../controllers/user.js';

router.post('/signup', user.signup);
router.post('/login', user.login);
router.get('/login', user.login_page);
router.get('/logout', user.logout);
router.get('/signup', user.signup_page)
export default router;