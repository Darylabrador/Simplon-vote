const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;

const voteSchema = mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    quota: {
        type: Number,
        required: true
    },
    choices: {
        type: Array
    },
    nbVote: {
        type: Number
    },
    createdBy: {
        type: ObjectId,
        ref: 'user'
    },
    participants: {
        type: Array,
    },
    visibility: {
        type: String,
        required: true,
        enum: ['public', 'private'],
        default: "public"
    },
    status: {
        type: String,
        required: true,
        enum: ['created', 'inprogress', 'finished'],
        default: "created"
    }
},{ timestamps: true })

module.exports = mongoose.model('vote', voteSchema)