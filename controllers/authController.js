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
        path: ''
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
        path: ''
    });
};