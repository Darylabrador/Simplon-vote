const express           = require('express');
const { body }          = require('express-validator');

const apiUserController = require('../controllers/api/apiUserController');
const User              = require('../models/users');

const router         = express.Router();

/** Routes to users's API
 * @module routers/apiUser
 * @requires express express.Router()
 */

/**
* get the list of users
* @name List GET
* @function
* @memberof module:routers/apiUser
* @param {string} '/api/users' - uri
* @param {function} apiUserController.list
* @return {JSON}
*/
router.get('/', apiUserController.list);

/**
 * Get specific vote's informations thanks to id
 * @name Show GET
 * @function
 * @memberof module:routers/apiUser
 * @param {string} '/api/users/:id' - uri
 * @param {function} apiUserController.show
 * @return {JSON}
 */
router.get('/:id', apiUserController.show);

// /**
//  * Add a new user
//  * @name Add POST
//  * @function
//  * @memberof module:routers/apiUser
//  * @param {string} '/api/users' - uri
//  * @param {function} apiUserController.add
//  * @return {JSON}
//  */
// router.post('/', apiUserController.add);

// /**
//  * Get information about one specific user identify by id
//  * @name Update PUT
//  * @function
//  * @memberof module:routers/apiUser
//  * @param {string} '/api/users/:id' - uri
//  * @param {function} apiUserController.update
//  * @return {JSON}
//  */
// router.put('/:id', apiUserController.update);

// /**
//  * Delete one specific user identify by id
//  * @name Delete DELETE
//  * @function
//  * @memberof module:routers/apiUser
//  * @param {string} '/api/users/:id' - uri
//  * @param {function} apiUserController.delete
//  * @return {JSON}
//  */
// router.delete('/:id', apiUserController.delete);

module.exports = router;