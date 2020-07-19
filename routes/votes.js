const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/adminController');
const votesController = require('../controllers/votesController');

const router = express.Router();

/** Views rotues
 * @module routers/votes
 * @requires express express.Router()
 */

/**
 * Return view with votes created by the logged user
 * @name showCreated GET
 * @function
 * @memberof module:routers/votes
 * @param {string} '/dashboard/created' - uri
 * @param {function} votesController.showCreated
 */
router.get('/created', isAuth, votesController.showCreated);


/**
 * Return view with votes enrolled by the logged user
 * @name showEnrolled GET
 * @function
 * @memberof module:routers/votes
 * @param {string} '/dashboard/enrolled' - uri
 * @param {function} votesController.showEnrolled
 */
router.get('/enrolled', isAuth, votesController.showEnrolled);


/**
 * Return view with inprogress votes
 * @name showInprogress GET
 * @function
 * @memberof module:routers/votes
 * @param {string} '/dashboard/inprogress' - uri
 * @param {function} votesController.showInprogress
 */
router.get('/inprogress', isAuth, votesController.showInprogress);


/**
 * Return view with finished votes
 * @name showFinished GET
 * @function
 * @memberof module:routers/votes
 * @param {string} '/dashboard/finished' - uri
 * @param {function} votesController.showFinished
 */
router.get('/finished', isAuth, votesController.showFinished);


/**
 * Return view with information about result's vote
 * @name showResult GET
 * @function
 * @memberof module:routers/votes
 * @param {string} '/dashboard/result/:id' - uri
 * @param {function} votesController.showResult
 */
router.get('/result/:id', isAuth, votesController.showResult);

/**
 * Return view with information about specific vote
 * @name showVote GET
 * @function
 * @memberof module:routers/votes
 * @param {string} '/dashboard/vote/:id' - uri
 * @param {function} votesController.showVote
 */
router.get('/vote/:id', isAuth, votesController.showVote);

/**
 * Handling post information about creating a subject vote
 * @name addVote POST
 * @function
 * @memberof module:routers/votes
 * @param {string} '/dashboard/vote/add' - uri
 * @param {function} votesController.addVote
 */
router.post(
    '/vote/add', 
    isAuth, 
    [
        body('visibility', 'Veuillez choisir la visibilité du vote : public ou privé')
            .trim()
            .not()
            .isEmpty(),
        body('subject', 'Veuillez renseigner le sujet du vote')
            .trim()
            .not()
            .isEmpty(),
        body('quota')
            .custom((value, {req}) =>{
                if(value < 2){
                    throw new Error('Le nombre de participant doit être égale ou supérieur à 2')
                }
                return true;
            }),
        body('createdBy', 'Une information est manquante')
            .trim()
            .not()
            .isEmpty(),
        body('choices')
            .custom((value, {req}) =>{
                if (value < 2) {
                    throw new Error('Il faut au minimum 2 options de réponse')
                }
                return true;
            }),
    ],
    adminController.addVote
);

/**
 * Handling the post request when user enrolled to subject vote
 * @name postEnrolledUser POST
 * @function
 * @memberof module:routers/votes
 * @param {string} '/dashboard/vote/enrolled/' - uri
 * @param {function} adminController.postEnrolledUser
 */
router.post(
    '/vote/enrolled', 
    isAuth, 
    [
        body('voteId', 'Nous ne pouvons pas prendre en compte votre participation')
            .trim()
            .not()
            .isEmpty(),
        body('userId', 'Nous ne pouvons pas prendre en compte votre participation')
            .trim()
            .not()
            .isEmpty(),
    ],
    adminController.postEnrolledUser
);

module.exports = router;