const mongoose = require("mongoose");

const { validationResult } = require('express-validator');

const User                 = require('../models/users');
const Vote                 = require('../models/votes');
const UsersVotes           = require('../models/usersVotes');

/** Create one vote
 * @name addVote
 * @function
 * @param {string} subject
 * @param {integer} quota
 * @param {array} choices
 * @param {integer} nbVote
 * @param {OjectId} createdBy
 * @param {array} participants
 * @param {string} visibility ['public', 'private']
 * @param {string} status ['created', 'inprogress', 'finished']
 * @throws {JSON} - Renvoie un JSON en cas d'erreur
 */
exports.addVote = async (req, res) => {
    const { subject, quota, choices, createdBy, visibility } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    
    try {
        const vote = new Vote({
            subject,
            quota,
            choices,
            nbVote: 0,
            createdBy,
            participants: [],
            visibility,
            status: 'created'
        });

        await vote.save();

        res.status(201).json({
            success: true,
            message: "Votre sujet de vote a bien été ajouté !"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Une erreur est survenue lors de l'ajout !"
        });
    }
};

/** Enrolled user to specific vote subject
 * @name postEnrolledUser
 * @function
 * @param {string} voteId
 * @param {string} userId
 * @throws {JSON} - Renvoie un JSON en cas d'erreur
 */
exports.postEnrolledUser = async (req, res, next) =>{
    const { voteId, userId } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/dashboard');
    }

    try {
        // get informations about nbTotalParticipant and nbTotalMaxParticipant (block request if this 2 values are equal)
        const nbTotal               = await Vote.findOne({ _id: voteId });
        const nbTotalParticipant    = nbTotal.participants.length;
        const nbTotalMaxParticipant = nbTotal.quota;
        const creator               = nbTotal.createdBy;

        if(creator == userId){
            req.flash('error', 'Vous ne pouvez pas participer à votre propre sujet de vote');
            return res.redirect('/dashboard');
        }

        if (nbTotalParticipant != nbTotalMaxParticipant) {
            const userVoteExist = await UsersVotes.findOne({ user: userId, vote: voteId });

            if (!userVoteExist) {
                const userVote = await new UsersVotes({
                    user: userId,
                    vote: voteId
                });

                await userVote.save();
                await Vote.updateOne({ _id: voteId }, { $push: { participants: userId } });

                // get information about participants and quota to update status if they are equals.
                const participantLength = await Vote.findOne({ _id: voteId });
                const nbParticipant     = participantLength.participants.length;
                const nbMaxParticipant  = participantLength.quota;
        
                if (nbParticipant == nbMaxParticipant) {
                    await Vote.update({ _id: voteId }, { $set: { status: 'inprogress' } });
                    req.flash('success', `Le vote est ouvert : ${participantLength.subject}`);
                } else {
                    req.flash('success', 'Vous êtes inscrit à un vote');
                }

                res.redirect('/dashboard');
            } else {
                req.flash('error', 'Vous participer déjà à ce vote');
                res.redirect('/dashboard');
            }
        }
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

/** add user choice to specific vote subject
 * @name postEnrolledUser
 * @function
 * @param {string} voteId
 * @param {string} userId
 * @throws {JSON} - Renvoie un JSON en cas d'erreur
 */
exports.postUserChoice = async (req, res) => {
    try {
        const { userId, voteId, choice } = req.body;
        const voted = await UsersVotes.countDocuments({ user: userId, vote: voteId, choice: null });

        if (voted == 1) {
            let choiceValue = parseInt(choice);
            await UsersVotes.updateOne({ user: userId, vote: voteId }, { $set: { choice: choiceValue } });
            await Vote.updateOne({ _id: voteId }, { $inc: { nbVote: 1 } });

            const finishedVote  = await Vote.findOne({ _id: voteId });
            const nbVote        = finishedVote.nbVote;
            const quota         = finishedVote.quota;

            if (nbVote == quota) {
                await Vote.update({ _id: voteId }, { $set: { status: 'finished' } });
            }

            req.flash('success', 'Votre vote a bien été pris en compte');
            res.redirect('/dashboard');
        }
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};


/** Enrolled user to specific vote subject which is private
 * @name postEnrolledPrivateVote
 * @function
 * @param {string} shareVoteId
 * @throws {JSON} - Renvoie un JSON en cas d'erreur
 */
exports.postEnrolledPrivateVote = async (req, res, next) => {
    const shareVoteId = req.params.shareVoteId;
    const userId      = req.user._id;
    const errors      = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/dashboard');
    }

    try {
        // get informations about nbTotalParticipant and nbTotalMaxParticipant (block request if this 2 values are equal)
        const nbTotal               = await Vote.findOne({ _id: shareVoteId });
        const nbTotalParticipant    = nbTotal.participants.length;
        const nbTotalMaxParticipant = nbTotal.quota;
        const creator               = nbTotal.createdBy;

        if (creator == userId) {
            req.flash('error', 'Vous ne pouvez pas participer à votre propre sujet de vote');
            return res.redirect('/dashboard');
        }

        if (nbTotalParticipant != nbTotalMaxParticipant) {
            const userVoteExist = await UsersVotes.findOne({ user: userId, vote: shareVoteId });

            if (!userVoteExist) {
                const userVote = await new UsersVotes({
                    user: userId,
                    vote: shareVoteId
                });

                await userVote.save();
                await Vote.updateOne({ _id: shareVoteId }, { $push: { participants: userId } });

                // get information about participants and quota to update status if they are equals.
                const participantLength = await Vote.findOne({ _id: shareVoteId });
                const nbParticipant = participantLength.participants.length;
                const nbMaxParticipant = participantLength.quota;

                if (nbParticipant == nbMaxParticipant) {
                    await Vote.update({ _id: shareVoteId }, { $set: { status: 'inprogress' } });
                    req.flash('success', `Le vote est ouvert : ${participantLength.subject}`);
                } else {
                    req.flash('success', 'Vous êtes inscrit à un vote');
                }

                res.redirect('/dashboard');
            } else {
                req.flash('error', 'Vous participer déjà à ce vote');
                res.redirect('/dashboard');
            }
        }
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};