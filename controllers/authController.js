const { validationResult }  = require('express-validator');
const bcrypt                = require('bcryptjs');

const User = require('../models/users');

/**
 * Get login page
 * 
 * Render the login page
 * @function getLogin
 * @returns {VIEW} login view
 * @throws Will throw an error if one error occursed
 */
exports.getLogin = (req, res, next) =>{
    res.render('auth/login', {
        title: "Connexion",
        path: '',
        errorMessage: null,
        hasError: false,
        validationErrors: []
    });
};

/**
 * Get signup page
 *
 * Render the signup page
 * @function getSignup
 * @returns {VIEW} signup view
 * @throws Will throw an error if one error occursed
 */
exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        title: "Inscription",
        path: '',
        errorMessage: null,
        hasError: false,
        validationErrors: []
    });
};

/**
 * Handle post login
 *
 * @function postLogin
 * @returns {VIEW} redirect to '/votes/dashboard'
 * @throws Will throw an error if one error occursed
 */
exports.postLogin = (req, res, next) =>{
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            title: 'Connexion',
            errorMessage: errors.array()[0].msg,
            hasError: true,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({email: email})
        .then(user =>{
            if(!user){
                req.flash('error', 'Adresse email ou mot de passe invalide');
                return res.redirect('/login');;
            }  
            bcrypt.compare(password, user.password)
                .then(isEqual => {
                    if (isEqual) {
                        req.session.isLoggedIn = true;
                        req.session.userId = user._id;
                        return req.session.save(err => {
                            res.redirect('/');
                        })
                    }
                    req.flash('error', 'Adresse email ou mot de passe invalide');
                    res.redirect('/login');
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

/**
 * Handle post signup
 *
 * @function postSignup
 * @returns {VIEW} redirect to '/login'
 * @throws Will throw an error if one error occursed
 */
exports.postSignup = (req, res, next) =>{
    const { pseudo, email, password, passwordConfirm } = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup', {
            path: '/signup',
            title: 'Inscription',
            errorMessage: errors.array()[0].msg,
            hasError: true,
            oldInput: {
                pseudo: pseudo,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm
            },
            validationErrors: errors.array()
        });
    }

    bcrypt.hash(password, 12)
        .then(hashedPwd =>{
            const user = new User({
                login: pseudo,
                email: email,
                password: hashedPwd
            });
            return user.save();
        })
        .then(result =>{
            res.redirect('/login');
        })
        .catch(err =>{
            return res.status(500).render('auth/signup', {
                path: '/signup',
                title: 'Inscription',
                errorMessage: "Adresse email ou pseudo existe déjà",
                hasError: true,
                oldInput: {
                    pseudo: pseudo,
                    email: email,
                    password: password,
                    passwordConfirm: passwordConfirm
                },
                validationErrors: []
            });
        });
};


/**
 * Handle logout
 *
 * @function postLogout
 * @returns {VIEW} redirect to '/login'
 */
exports.postLogout = (req, res, next) =>{
    req.session.destroy((err) => {
        res.redirect('/login');
    });
};