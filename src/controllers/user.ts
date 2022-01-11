import { body, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { default as multerMod } from 'multer'
import { RequestHandler, Request, Response, NextFunction } from "express";
import { ClientHashedPassword } from "../models/password.js";
const multer = multerMod()

export const signup = [
    multer.none(),
    body('username').isEmail(),
    body('password').isLength({ min: 1, max: 64 }),
    (req: Request<{}, {}, { password: string, username: string }>, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(432).json({ errors: errors.array() });
        }
        const password = new ClientHashedPassword(req.body.password);
        password.serverHashed()
            .then((password) => {
                const user = new User(req.body.username, password);
                user.save().then(() => res.redirect('/'))
            })
            .catch(() => { }
            )
    }];
export const login: RequestHandler[] = [
    multer.none(),
    body('username').isEmail().withMessage('Please provide an email'),
    body('password')
        .isLength({ min: 64, max: 64 })
        .isLowercase()
        .isHexadecimal()
        .withMessage('Password was not sent properly.'),
    (req: Request<{}, {}, { username: string, password: string }>, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        User.auth_user(req.body.username, new ClientHashedPassword(req.body.password))
            .then((result) => {
                if (result === null || result.valid === false) {
                    return res.status(403).end();
                } else {
                    req.session.regenerate((err) => {
                        req.session.userID = result.user.id.toHexString()
                        res.redirect('/')
                    })
                }
            })
    }];

export const login_page: RequestHandler = (req, res, next) => {
    res.render('login', { title: 'Log in' })
};

export const signup_page: RequestHandler = (req, res, next) => {
    res.render('signup', { title: 'Sign up' })
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/');
    })
}