const express        = require('express');
const { body }       = require('express-validator');

const authController = require('../controllers/authController');
const User           = require('../models/users');

const router         = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);

module.exports = router;