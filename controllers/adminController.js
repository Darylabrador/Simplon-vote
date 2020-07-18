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
