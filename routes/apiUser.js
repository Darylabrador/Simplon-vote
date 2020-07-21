const express           = require('express');
const { body }          = require('express-validator');

const apiUserController = require('../controllers/api/apiUserController');
const User              = require('../models/users');

const router         = express.Router();

module.exports = router;