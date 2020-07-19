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
exports.getDashboard = async (req, res, next) => {
    try {
        const votes = await Vote.find().sort({ createdAt: -1 }).populate('createdBy').exec();
        res.render('votes/dashboard', {
            title: "Dashboard",
            path: '/dashboard',
            votes: votes,
            errorMessage: null
        }); 
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }

};

/**
 * Get showcreated page
 * 
 * Render the showcreated page with owner vote
 * @function showCreated
 * @returns {VIEW} showcreated view
 * @throws Will throw an error if one error occursed
 */
exports.showCreated = async (req, res, next) => {
    try {
        const votes = await Vote.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).populate('createdBy').exec()
        res.render('votes/owner-vote', {
            title: "Mes créations",
            path: '/dashboard/created',
            votes: votes,
            errorMessage: null
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

/**
 * Get showEnrolled page
 * 
 * Render the showEnrolled page
 * @function showEnrolled
 * @returns {VIEW} showEnrolled view
 * @throws Will throw an error if one error occursed
 */
exports.showEnrolled = async (req, res, next) => {
    try {
        const votes = await UsersVotes.find({ user: req.user._id }).populate({
            path: 'vote',
            options: {
                sort : { createdAt: -1 }
            },
            populate: {
                path: 'createdBy',
                model: 'user'
            }
        }).exec();
        res.render('votes/enrolled-vote', {
            title: "Mes participations",
            path: '/dashboard/enrolled',
            votes: votes,
            errorMessage: null
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }

};


/**
 * Get showinprogress page
 * 
 * Render the showinprogress page
 * @function showInprogress
 * @returns {VIEW} showinprogress view
 * @throws Will throw an error if one error occursed
 */
exports.showInprogress = async (req, res, next) => {
    try {
        const inprogress = 'inprogress';
        const votes = await Vote.find({ status: inprogress }).sort({ createdAt: -1 }).populate('createdBy').exec()
        res.render('votes/inprogress-vote', {
            title: "Votes en cours",
            path: '/dashboard/inprogress',
            votes: votes,
            errorMessage: null
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};


/**
 * Get showFinished page
 * 
 * Render the showFinished page
 * @function showFinished
 * @returns {VIEW} showFinished view
 * @throws Will throw an error if one error occursed
 */
exports.showFinished = async (req, res, next) => {
    try {
        const terminer = 'finished';
        const votes = await Vote.find({ status: terminer }).sort({ createdAt: -1 }).populate('createdBy').exec();
        res.render('votes/finished-vote', {
            title: "Votes finis",
            path: '/dashboard/finished',
            votes: votes,
            errorMessage: null
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};


/**
 * Get one vote page
 * 
 * Render one vote page
 * @function showVote
 * @returns {VIEW} detail view
 * @throws Will throw an error if one error occursed
 */
exports.showVote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const vote = await Vote.findById(id).populate({ path: 'createdBy', select: 'login -_id' }).exec();
        const notVotedYet = await UsersVotes.countDocuments({ user: req.user._id, vote: id, choice: null });
        if (!vote) {
            req.flash('error', 'vote non trouvé');
            return res.redirect('/dashboard');
        }
        res.render("votes/details", {
            title: "Détails",
            path: '/dashboard/details',
            vote: vote,
            alreadyVoted: notVotedYet,
            errorMessage: null
        }); 
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};


/**
 * Get showResult page for specific vote
 * 
 * Render the showResult page for specific vote
 * @function showResult
 * @returns {VIEW} showResult view
 * @throws Will throw an error if one error occursed
 */
exports.showResult = async (req, res, next) => {
    try {
        const id = req.params.id;
        const resultVote = await UsersVotes.find({ vote: id }).populate('vote').exec();
        let choicesArray = Object.values(resultVote[0].vote.choices);
        let subject = resultVote[0].vote.subject;
        let usersChoice = [];
        let result = [];
        let count = 0;

        resultVote.forEach(items => {
            usersChoice.push(items.choice);
        })

        usersChoice = usersChoice.sort();
        let totalOptions = usersChoice.length;
        let prev = usersChoice[0];
        let resultChoice;

        for (let i = 0; i < usersChoice.length; i++) {
            if (usersChoice[i] == prev) {
                count++;
            }
            if (usersChoice[i + 1] != undefined) {
                if (usersChoice[i] != usersChoice[i + 1]) {
                    // affectation de la valeur dans le tableau
                    resultChoice = {
                        choix: choicesArray[prev],
                        nbvote: count
                    }
                    result.push(resultChoice);
                    prev = usersChoice[i + 1];
                    count = 0;
                }
            } else {
                // affectation de la valeur dans le tableau
                resultChoice = {
                    choix: choicesArray[prev],
                    nbvote: count
                }
                result.push(resultChoice);
                prev = usersChoice[i];
                count = 0;
            }
        };

        res.render('votes/result-vote', {
            title: "Résultat du vote",
            path: '/dashboard/result',
            subject: subject,
            resultat: result,
            totaloptions: totalOptions,
            errorMessage: null
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};