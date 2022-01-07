const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const User = require('../models/user')
exports.signup = [
    body('username').isEmail(),
    body('password').isLength({ min: 1, max: 64 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.username,
                    password: hash
                });
                user.save()
                    .then(() => res.redirect('/'))
                    .catch(error => res.status(400).send());
            })
            .catch(error => { console.log(error); res.status(500).json({ error }) });
    }];
exports.login = [
    body('username').isEmail(),
    body('password').isLength({ min: 1, max: 64 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        User.findOne({ email: req.body.username })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: 'Mot de passe incorrect !' });
                        } else {
                            req.session.regenerate((err) => {
                                req.session.user = user
                                res.redirect('/edit/new')
                            })
                        }
                    })
                    .catch(error => { console.log(error); res.status(500).json({ error }) });
            })
            .catch(error => res.status(500).json({ error }));
    }];

exports.login_page = (req, res, next) => {
    res.render('login', { title: 'Log in' })
};

exports.signup_page = (req, res, next) => {
    res.render('signup', { title: 'Sign up' })
};