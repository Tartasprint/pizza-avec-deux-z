import { body, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { default as multerMod } from 'multer'
const multer = multerMod()

export const signup = [
    multer.none(),
    body('username').isEmail(),
    body('password').isLength({ min: 1, max: 64 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(432).json({ errors: errors.array() });
        }
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.username,
                    password: hash
                });
                user.save()
                    .then(() => res.redirect('/'))
                    .catch(error => res.status(431).send());
            })
            .catch(error => { console.log(error); res.status(500).json({ error }) });
    }];
export const login = [
    multer.none(),
    body('username').isEmail().withMessage('Please provide an email'),
    body('password')
        .isLength({ min: 64, max: 64 })
        .isLowercase()
        .isHexadecimal()
        .withMessage('Password was not sent properly.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        User.findOne({ email: req.body.username })
            .then(user => {
                if (!user) {
                    return res.status(403).end();
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(403).end();
                        } else {
                            req.session.regenerate((err) => {
                                req.session.user = user
                                res.redirect('/')
                            })
                        }
                    })
                    .catch(error => { console.log(error); res.status(500).end() });
            })
            .catch(error => res.status(500).end());
    }];

export const login_page = (req, res, next) => {
    res.render('login', { title: 'Log in' })
};

export const signup_page = (req, res, next) => {
    res.render('signup', { title: 'Sign up' })
};

export const logout = (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/');
    })
}