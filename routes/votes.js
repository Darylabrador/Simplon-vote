// const express = ;
const router = require('express').Router();
const voteController = require('../controllers/voteController.js');

/** Routes de l'API pour les sujets de vote
 * @module routers/votes
 * @requires express express.Router()
 */

/**
 * Renvoie la liste de tout les sujets de votes
 * @name List GET
 * @function
 * @memberof module:routers/votes
 * @param {string} '/api/votes' - uri
 * @param {function} voteController.list
 * @return {JSON}
 */
router.get('/', voteController.list)

/**
 * Ajoute un nouveau sujet de vote
 * @name Add POST
 * @function
 * @memberof module:routers/votes
 * @param {string} '/api/votes' - uri
 * @param {function} voteController.add
 * @return {JSON}
 */
router.post('/', voteController.add)

/**
 * Renvoie les informations d'un sujet de vote par rapport à un identifiant 
 * @name Show GET
 * @function
 * @memberof module:routers/votes
 * @param {string} '/api/votes/:id' - uri
 * @param {function} voteController.show
 * @return {JSON}
 */
router.get('/:id', voteController.show)

/**
 * Modifie un sujet de vote par rapport à son identifiant
 * @name Update PUT
 * @function
 * @memberof module:routers/votes
 * @param {string} '/api/votes/:id' - uri
 * @param {function} voteController.update
 * @return {JSON}
 */
router.put('/:id', voteController.update);

/**
 * Supprime un sujet de vote par rapport à son identifiant
 * @name Delete DELETE
 * @function
 * @memberof module:routers/votes
 * @param {string} '/api/votes/:id' - uri
 * @param {function} voteController.delete
 * @return {JSON}
 */
router.delete('/:id', voteController.delete);


// router.get('/api/ajout',voteController.ajout );
// router.get('/api/votes/:id',voteController.detailvote );
// router.post('/api/votes',voteController.addvote );
// router.delete('/api/votes/:id',voteController.deletevote );
// router.put('/api/votes/:id',voteController.updatevote );

// router.post("/api/login",usersController.login);
// router.post("/api/login",usersController.signup);
// router.get('/',voteController.liste );


module.exports = router;
