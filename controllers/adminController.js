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
                req.flash('success', 'Vous êtes inscrit à un vote');

                if (nbParticipant == nbMaxParticipant) {
                    await Vote.update({ _id: voteId }, { $set: { status: 'inprogress' } });
                    req.flash('success', 'Le vote est ouvert');
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
}