var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController.js');
var usersController = require('../controllers/userController.js');
const isAuth        = require('../middleware/is-auth');

/** Routes des vues
 * @module routers/index
 * @requires express express.Router()
 */

/**
 * Retourne la vue de l'inscription
 * @name Inscription GET
 * @function
 * @memberof module:routers/index
 * @param {string} '/inscription' - uri
 * @param {function} indexController.inscription
 */
router.get('/inscription', indexController.inscription);

/**
 * Page de connexion qui est la première vue de l'application
 * @name loginpage GET
 * @function
 * @memberof module:routers/index
 * @param {string} '/' - uri
 * @param {function} indexController.loginpage
 */
router.get('/', indexController.loginpage);

/**
 * Retourne la vue pour afficher un sujet de vote par rapport à son identifiant
 * @name Show GET
 * @function
 * @memberof module:routers/index
 * @param {string} '/votes/:id' - uri
 * @param {function} indexController.show
 */
router.get('/votes/:id', isAuth, indexController.show);

/**
 * Retourne la vue pour l'ajout d'un sujet de vote  
 * @name Add POST
 * @function
 * @memberof module:routers/index
 * @param {string} '/votes' - uri
 * @param {function} indexController.add
 */
router.post('/votes', isAuth, indexController.add);

/**
 * Supprime un sujet de vote par rapport à son identifiant
 * @name  Delete DELETE
 * @function
 * @memberof module:routers/index
 * @param {string} '/votes/:id' - uri
 * @param {function} indexController.delete
 */
router.delete('/votes/:id', isAuth, indexController.delete);


router.put('/votes/:id', isAuth, indexController.update);
router.get('/inscription', indexController.inscription);
router.post('/addUser', indexController.addUser);
router.get('/logout', indexController.logout);
router.post('/login', indexController.login);
router.get('/login',indexController.visulogin);
router.get('/ajout', indexController.ajout);

router.get('/dashboard', isAuth, indexController.dashboard);
router.get('/dashboard/finished', isAuth, indexController.showend );
router.get('/dashboard/inprogress', isAuth, indexController.showinprogress );
router.get('/dashboard/created', isAuth, indexController.showcreated );
router.get('/dashboard/enrolled', isAuth, indexController.showparticipated);

router.post('/participate', indexController.participatetovote);
router.post('/addvote', indexController.addvote);
router.get('/result/:id', indexController.resultvote);

module.exports = router;