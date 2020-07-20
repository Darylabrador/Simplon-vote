const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;

const userVoteSchema = mongoose.Schema({
    user: {
        type: ObjectId,
        required: true,
        ref: 'user'
    },
    vote: {
        type: ObjectId,
        required: true,
        ref: 'vote'
    },
    choice: {
        type: Number,
        default: null
    },
},{ collection: 'usersVotes' });

module.exports = mongoose.model('userVote', userVoteSchema);