const express = require('express');
const router = express.Router();
const User = require("../models/user");
const userController = require('../controllers/userController.js');

/** Routes de l'API pour les utilisateurs
 * @module routers/users
 * @requires express express.Router()
 */


/**
 * Renvoie la liste de tout les utilisateurs
 * @name List GET
 * @function
 * @memberof module:routers/users
 * @param {string} '/api/users' - uri
 * @param {function} userController.list
 * @return {JSON}
 */
router.get('/', userController.list);

/**
 * Ajoute un nouvel utilisateur 
 * @name Add POST
 * @function
 * @memberof module:routers/users
 * @param {string} '/api/users' - uri
 * @param {function} userController.add
 * @return {JSON}
 */
router.post('/', userController.add)

/**
 * Connecte un utilisateur
 * @name Login POST
 * @function
 * @memberof module:routers/users
 * @param {string} '/api/users/login' - uri
 * @param {function} userController.login
 * @return {JSON}
 */
router.post('/login', userController.login);

/**
 * Inscrit un utilisateur
 * @name Signup POST
 * @function
 * @memberof module:routers/users
 * @param {string} '/api/users/signup' - uri
 * @param {function} userController.signup
 * @return {JSON}
 */
router.post('/signup', userController.signup);

/**
 * Renvoie les informations d'un utilisateur par rapport à son identifiant
 * @name Show GET
 * @function
 * @memberof module:routers/users
 * @param {string} '/api/users/:id' - uri
 * @param {function} userController.show
 * @return {JSON}
 */
router.get('/:id', userController.show)

/**
 * Modifie un utilisateur par rapport à son identifiant
 * @name Update PUT
 * @function
 * @memberof module:routers/users
 * @param {string} '/api/users/:id' - uri
 * @param {function} userController.update
 * @return {JSON}
 */
router.put('/:id', userController.update);

/**
 * Supprime un utilisateur par rapport à son utilisateur
 * @name Delete DELETE
 * @function
 * @memberof module:routers/users
 * @param {string} '/api/users/:id' - uri
 * @param {function} userController.delete
 * @return {JSON}
 */
router.delete('/:id', userController.delete);

module.exports = router;