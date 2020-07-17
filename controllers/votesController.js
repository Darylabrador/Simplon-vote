const mongoose = require("mongoose");

const User       = require('../models/users');
const Vote       = require('../models/votes');
const UsersVotes = require('../models/usersVotes');

/**
 * Get getDashboard page
 * 
 * Render the getDashboard page with all vote
 * @function getDashboard
 * @returns {VIEW} getDashboard view
 * @throws Will throw an error if one error occursed
 */
exports.getDashboard = (req, res, next) => {
    res.render('votes/dashboard', {
        title: "Dashboard",
        path: ''
    });
};

/**
 * Get showcreated page
 * 
 * Render the showcreated page with owner vote
 * @function showCreated
 * @returns {VIEW} showcreated view
 * @throws Will throw an error if one error occursed
 */
exports.showCreated = (req, res, next) => {
    res.render('votes/owner-vote', {
        title: "Mes créations",
        path: ''
    });
};

/**
 * Get showEnrolled page
 * 
 * Render the showEnrolled page
 * @function showEnrolled
 * @returns {VIEW} showEnrolled view
 * @throws Will throw an error if one error occursed
 */
exports.showEnrolled = (req, res, next) => {
    res.render('votes/enrolled-vote', {
        title: "Mes participations",
        path: ''
    });
};


/**
 * Get showinprogress page
 * 
 * Render the showinprogress page
 * @function showInprogress
 * @returns {VIEW} showinprogress view
 * @throws Will throw an error if one error occursed
 */
exports.showInprogress = (req, res, next) => {
    res.render('votes/inprogress-vote', {
        title: "Votes en cours",
        path: ''
    });
};


/**
 * Get showFinished page
 * 
 * Render the showFinished page
 * @function showFinished
 * @returns {VIEW} showFinished view
 * @throws Will throw an error if one error occursed
 */
exports.showFinished = (req, res, next) => {
    res.render('votes/finished-vote', {
        title: "Votes finis",
        path: ''
    });
};


/**
 * Get showResult page
 * 
 * Render the showResult page
 * @function showResult
 * @returns {VIEW} showResult view
 * @throws Will throw an error if one error occursed
 */
exports.showResult = (req, res, next) => {
    res.render('votes/result-vote', {
        title: "Résultat du vote",
        path: ''
    });
};