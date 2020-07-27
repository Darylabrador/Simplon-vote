const dotenv   = require('dotenv').config();
const expect   = require('chai').expect
const sinon    = require('sinon');

const bcrypt = require('bcryptjs');

const User           = require('../models/users');
const mongoose       = require('mongoose');
const AuthController = require('../controllers/authController');

describe('Auth Controller', function(){
    before(function (done) {
        mongoose.connect( process.env.DB_URL_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        .then(result => {
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


    it('should throwan error with http code 500 if accessing database failed', function (done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();
        const req = {
            body: {
                email: 'test@test.com',
                password: 'usertest123456'
            }
        }
        AuthController.postLogin(req, {}, () => { }).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('httpStatusCode', 500);
            done();
        });
        User.findOne.restore();
    });

    it('should return a created user with GithubUser\'s information', function(done){
        sinon.stub(bcrypt, 'hash');
        bcrypt.hash.returns('123456');
        const req = {
            body: {
                pseudo: 'GithubUser',
                email: 'GithubUser@test.com',
                password: '123456',
                passwordConfirm: '123456'
            },
            flash: function(){
                return this;
            }
        }
        const res = {
            redirect: function(){
                return this;
            },
            status: function () {
                return this;
            },
            render: function () {}
        }
        AuthController.postSignup(req, res, () => { }).then((userCreated) =>{
            expect(userCreated).to.have.property('login', 'GithubUser');
            expect(userCreated).to.have.property('email', 'GithubUser@test.com');
            expect(userCreated).to.have.property('password', '123456');
            done();
        });
        bcrypt.hash.restore();
    });

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
});