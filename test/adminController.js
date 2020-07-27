const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const server = app.listen(8080);

const { assert, expect } = require('chai')
const sinon  = require('sinon');

const User  = require('../models/users');
const Votes = require('../models/votes');

const mongodb        = require('mongodb');
const mongoose       = require('mongoose');
const AdminController = require('../controllers/adminController');

describe('Admin Controller', function () {
    before(function (done) {
        mongoose.connect(process.env.DB_URL_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        .then(result => {
            const io = require('../socket').init(server);
            const user = new User({
                login: 'testuser',
                email: 'test@test.com',
                password: 'usertest123456',
                _id: '5c0f66b979af55031b34728a'
            });
            return user.save();
        })
        .then(() => {
            done();
        });
    });

    it('should return create subject vote information', function(done){
        const req = {
            body: {
                subject: 'test subject',
                quota : 2,
                choices: ['choice1', 'choice2'],
                nbVote: 0,
                createdBy: '5c0f66b979af55031b34728a',
                participants: [],
                visibility: 'public',
                status: 'created'
            }
        };
        const res = {
            status: function(){
                return this;
            },
            json: function(){}
        };
        
        AdminController.addVote(req, res).then(result =>{
            assert.equal(result.createdBy, '5c0f66b979af55031b34728a')
            expect(result).to.have.property('subject', 'test subject');
            expect(result).to.have.property('quota', 2);
            expect(result.choices).to.have.length(2);
            expect(result).to.have.property('nbVote', 0);
            expect(result.participants).to.have.length(0);
            expect(result).to.have.property('visibility', 'public');
            expect(result).to.have.property('status', 'created');
            expect(result).to.have.property('createdAt');
            expect(result).to.have.property('updatedAt');
            return;
        }).then(() =>{
            done();
        });
    });

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                return Votes.deleteMany({});
            })
            .then(() =>{
                server.close();
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
});