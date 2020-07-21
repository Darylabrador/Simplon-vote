const express  = require('express');
const { body } = require('express-validator');

const apiVoteController = require('../controllers/api/apiVotesController');

const router = express.Router();

/** Routes to subject vote's API
 * @module routers/apiVote
 * @requires express express.Router()
 */

/**
* get the list of subject vote
* @name List GET
* @function
* @memberof module:routers/apiVote
* @param {string} '/api/votes' - uri
* @param {function} apiUserController.list
* @return {JSON}
*/
router.get('/', apiVoteController.list);

/**
 * Get specific vote's informations thanks to id
 * @name Show GET
 * @function
 * @memberof module:routers/apiVote
 * @param {string} '/api/votes/:id' - uri
 * @param {function} apiVoteController.show
 * @return {JSON}
 */
router.get('/:id', apiVoteController.show);

// /**
//  * Add new subject vote
//  * @name Add POST
//  * @function
//  * @memberof module:routers/apiVote
//  * @param {string} '/api/votes' - uri
//  * @param {function} apiVoteController.add
//  * @return {JSON}
//  */
// router.post('/', apiVoteController.add)

// /**
//  * Modify specific subject vote thanks to id
//  * @name Update PUT
//  * @function
//  * @memberof module:routers/apiVote
//  * @param {string} '/api/votes/:id' - uri
//  * @param {function} apiVoteController.update
//  * @return {JSON}
//  */
// router.put('/:id', apiVoteController.update);

// /**
//  * Delete specific subject vote thanks to id
//  * @name Delete DELETE
//  * @function
//  * @memberof module:routers/apiVote
//  * @param {string} '/api/votes/:id' - uri
//  * @param {function} apiVoteController.delete
//  * @return {JSON}
//  */
// router.delete('/:id', apiVoteController.delete);

module.exports = router;