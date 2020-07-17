const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/adminController');
const votesController = require('../controllers/votesController');

const router = express.Router();

router.get('/created', isAuth, votesController.showCreated);

router.get('/enrolled', isAuth, votesController.showEnrolled);

router.get('/inprogress', isAuth, votesController.showInprogress);

router.get('/finished', isAuth, votesController.showFinished);

router.get('/result/:id', isAuth, votesController.showResult);

module.exports = router;
