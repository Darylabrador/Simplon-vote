const express        = require('express');
const { body }       = require('express-validator');

const authController = require('../controllers/authController');
const User           = require('../models/users');

const router         = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', 
    [
        body('email')
            .isEmail()
            .withMessage('Veuillez saisir une adresse email valide'),
        body('password')
            .isLength({min: 5})
            .trim()
    ], 
    authController.postLogin
);

router.post('/signup', 
    [
        body('email')
            .isEmail()
            .withMessage('Veuillez saisir une adresse email valide'),
        body('password','Veuillez saisir un mot de passe qui contient au minimum 5 caractères')
            .isLength({ min: 5 })
            .trim(),
        body('passwordConfirm').trim()
            .custom((value, {req}) =>{
                if(value !== req.body.password){
                    throw new Error('Les mots de passe ne sont pas identiques')
                }
                return true;
            })
    ], 
    authController.postSignup
);

module.exports = router;