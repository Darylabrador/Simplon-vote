const mongoose = require("mongoose");
const Vote = require("../models/vote");
const User = require("../models/user");
const UsersVotes = require("../models/user_vote");
const validator = require('validator');

/** Controller INDEX
 * @module controllers/index
 * @requires mongoose
 */

//Set up default mongoose connection
// var mongoDB = 'mongodb://localhost:27017/simplon-vote';
// var ObjectId=mongoose.Types.ObjectId;
// mongoose.connect(mongoDB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

var controller = {}

/** 
 * Application's first page
 * @name loginpage
 * @memberof module:controllers/index
 * @function
 * @returns {VIEW}
 * @throws {JSON} - Renvoie un JSON en cas d'erreur
 */
controller.loginpage = async (req, res) => {
  if (!req.session.user) {
    res.render("index", {
      title: "application votes",
      path: ''
    });
  } else {
    res.redirect('/dashboard')
  }
}

controller.visulogin = async (req, res) => {
  if (!req.session.user) {
    res.render('./index.ejs', {
      title: "login",
      path: ''
    })
  } else {
    res.redirect('/dashboard')
  }
}

/** add one user
 * @name addUser
 * @memberof module:controllers/index
 * @fonction
 * @param {string} pseudo
 * @param {string} email
 * @param {string} mot de passe
 * @returns {VIEW} redirect to '/'
 */
controller.addUser = async (req, res) => {
  if (!validator.isEmail(req.body.email)) {
    return res.redirect('/')
  }

  User.create({
    login: validator.escape(req.body.pseudo),
    email: req.body.email,
    password: req.body.password
  }).then(res.redirect('/'))
}

/** add One vote
 * @name add
 * @memberof module:controllers/index
 * @function
 * @param {string} subject
 * @param {integer} quota
 * @param {array} choices
 * @param {integer} nbVote
 * @param {OjectId} createdBy
 * @param {array} participants
 * @param {string} status ['created', 'inprogress', 'finished']
 * @returns {VIEW} Redirect to '/'
 * @throws {JSON} - Renvoie un JSON en cas d'erreur
 */
controller.add = async (req, res) => {
  const { subject, quota, choices, createdBy, visibility } = req.body
  try {
    if (!validator.isEmpty(subject) && quota >= 2 && !validator.isEmpty(createdBy) && choices.length >= 2) {
      const vote = await Vote.create({
        subject,
        quota,
        choices,
        nbVote: 0,
        createdBy,
        participants: [],
        visibility,
        status: 'created'
      });
      res.status(201).json({
        success: true,
        message: "Votre sujet de vote a bien été ajouté !"
      })
    } else {
      res.json({
        success: false,
        message: "Des informations sont manquantes !"
      })
    }
  } catch (error) {
    res.status(400).json({
      result: "error"
    })
  }
}

controller.dashboard = async (req, res) => {
  const votes = await Vote.find().populate('createdBy').exec()
  console.log(req.session.user._id);
  res.render('./dashboard.ejs', {
    title: "sujet",
    votes: votes,
    path: '/dashboard'
  })
}

controller.login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    req.session.msgFlash = { type: "danger", message: "Donnée manquante" }
    res.redirect('/login')
  } else {
    try {
      const user = await User.findOne({ email: email })
      if (!user || (user.email !== email && user.password !== password)) {
        req.session.msgFlash = { type: "danger", message: "Identifiants invalide" }
        res.redirect('/login')
      } else {
        req.session.user = user // use session for user connected
        res.redirect('/dashboard')
      }
    } catch (error) {
      req.session.msgFlash = { type: "error", message: "Identifiants invalide" }
      res.redirect('/login',)
    }
  }
}

controller.logout = async (req, res) => {
  req.session = null
  res.redirect('/')
}

/** show one vote
 * @name show
 * @memberof module:controllers/index
 * @function
 * @returns {VIEW} "detail"
 * @throws {JSON} - Renvoie un JSON en cas d'erreur
 */
controller.show = async (req, res) => {
  const { id } = req.params
  try {
    const vote = await Vote.findById(id).populate({ path: 'createdBy', select: 'login -_id' }).exec();
    const notVotedYet = await UsersVotes.count({ user: req.session.user._id, vote: id, choice: null });

    if (!vote) {
      return res.status(400).json({
        result: "error",
        message: "vote non trouvé"
      })
    }
    res.render("./detail", {
      title: " inscription",
      path: '',
      vote: vote,
      alreadyVoted: notVotedYet
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      message: error
    })
  }
}

controller.inscription = async (req, res) => {
  try {
    res.render("inscription", {
      title: " inscription",
      path: ''
    })
  } catch (error) {
    res.status(400).json({
      result: "error"
    })
  }
}

/** Update one vote
 * @name update
 * @memberof module:controllers/index
 * @function
 * @param {string} subject
 * @param {integer} quota
 * @param {array} choices
 * @param {integer} nbVote
 * @param {OjectId} createdBy
 * @param {array} participants
 * @param {string} status ['created', 'inprogress', 'finished']
 * @returns {VIEW} Redirect to '/'
 * @throws {JSON} - Renvoie un JSON en cas d'erreur
 */
controller.update = async (req, res) => {
  const {
    id
  } = req.params
  const {
    subject,
    quota,
    choices,
    nbVote,
    createdBy,
    participants,
    status
  } = req.body
  try {
    const vote = await Vote.findByIdAndUpdate(id, {
      subject,
      quota,
      choices,
      nbVote,
      createdBy,
      participants,
      status
    }).setOptions({
      new: true, // for get the updated vote
      omitUndefined: true
    })
    res.redirect("/").json({
      result: "success",
      message: "vote supprimé"
    })
  } catch (error) {
    res.status(400).json({
      result: "error"
    })
  }
}

/** Delete one vote
 * @name delete
 * @memberof module:controllers/index
 * @throws {JSON} - Renvoie un JSON en cas d'erreur
 */
controller.delete = async (req, res) => {
  try {
    const {
      id
    } = req.params
    await Vote.findByIdAndRemove(id)
    res.status()
    resresultjson({
      result: "success",
      message: "vote supprimé"
    })
  } catch (error) {
    res.status(400).json({
      result: "error"
    })
  }
}

controller.ajout = async (req, res) => {
  res.status(201).json({
    user
  })
}

/** get data information about vote created by the user
 * @name showcreated
 * @memberof module:controllers/index
 * @param {object} req 
 * @param {object} res 
 */
controller.showcreated = async (req, res) => {
  const user = req.session.user;
  const votes = await Vote.find({ createdBy: user._id }).populate('createdBy').exec()
  res.render('./dashboard', {
    title: "Tous",
    votes: votes,
    path: '/dashboard/created'
  })
}

/** get data information about vote in progress
 * @name showinprogress
 * @memberof module:controllers/index
 * @param {object} req 
 * @param {object} res 
 */
controller.showinprogress = async (req, res) => {
  const inprogress = 'inprogress';
  const votes = await Vote.find({ status: inprogress }).populate('createdBy').exec()
  res.render('./inprogress', {
    title: "Sujets en cours",
    votes: votes,
    path: '/dashboard/inprogress'
  })
}

/** get data information about finished vote
 * @name showend
 * @memberof module:controllers/index
 * @param {object} req 
 * @param {object} res 
 */
controller.showend = async (req, res) => {
  const terminer = 'finished';
  const votes = await Vote.find({ status: terminer }).populate('createdBy').exec()
  res.render('./dashboard', {
    title: "Sujets terminées",
    votes: votes,
    path: '/dashboard/finished'
  })
}

/** get data information about users's enrolled vote
 * @name showparticipated
 * @memberof module:controllers/index
 * @param {object} req 
 * @param {object} res 
 */
controller.showparticipated = async (req, res) => {
  const user = req.session.user;
  const votes = await UsersVotes.find({ user: user._id }).populate({
    path: 'vote',
    populate: {
      path: 'createdBy',
      model: 'user'
    }
  }).exec()
  res.render('./enrolled', {
    title: "Mes participations",
    votes: votes,
    path: '/dashboard/enrolled'
  })
}

/** To send participation vote in specific array
 * @name participatetovote
 * @memberof module:controllers/index
 * @param {object} req 
 * @param {object} res 
 */
controller.participatetovote = async (req, res) => {
  const { voteId, userId } = req.body;

  // get informations about nbTotalParticipant and nbTotalMaxParticipant (block request iff this 2 values are the same)
  const nbTotal = await Vote.findOne({ _id: voteId });
  const nbTotalParticipant = nbTotal.participants.length;
  const nbTotalMaxParticipant = nbTotal.quota;

  try {
    if (nbTotalParticipant != nbTotalMaxParticipant) {
      const userVoteExist = await UsersVotes.findOne({ user: userId, vote: voteId });
      if (!userVoteExist) {
        const userVote = await UsersVotes.create({
          user: userId,
          vote: voteId
        });
        const userVotePartipation = await Vote.updateOne({ _id: voteId }, { $push: { participants: userId } });

        // get information about participants and quota to update status if they are equals.
        const participantLength = await Vote.findOne({ _id: voteId });
        const nbParticipant = participantLength.participants.length;
        const nbMaxParticipant = participantLength.quota;

        req.session.msgFlash = { type: "success", message: "Vous êtes inscrit à un vote" };

        if (nbParticipant == nbMaxParticipant) {
          const updatedStatus = await Vote.update({ _id: voteId }, { $set: { status: 'inprogress' } });
          req.session.msgFlash = { type: "success", message: "Le vote est ouvert" };
        }

        res.redirect('/dashboard');

      } else {
        req.session.msgFlash = { type: "danger", message: "Vous participer déjà à ce vote" };
        res.redirect('/dashboard');
      }
    }
  } catch (error) {
    res.status(400).json({
      result: "error"
    })
  }
}

/** Update user's choice in usersVotes's collection
 * @name addvote
 * @memberof module:controllers/index
 * @param {object} req 
 * @param {object} res 
 */
controller.addvote = async (req, res) => {
  let choiceValue;
  const { userId, voteId, choice } = req.body;
  const voted = await UsersVotes.count({ user: userId, vote: voteId, choice: null })
  try {
    if (voted == 1) {
      let choiceValue = parseInt(choice);
      const updatedUserChoice = await UsersVotes.updateOne({ user: userId, vote: voteId }, { $set: { choice: choiceValue } })
      const updatedVote = await Vote.updateOne({ _id: voteId }, { $inc: { nbVote: 1 } });

      const finishedVote = await Vote.findOne({ _id: voteId });
      const nbVote = finishedVote.nbVote;
      const quota = finishedVote.quota;

      if (nbVote == quota) {
        const updatedStatus = await Vote.update({ _id: voteId }, { $set: { status: 'finished' } });
      }
      req.session.msgFlash = { type: "success", message: "Votre vote a bien été pris en compte" };
      res.redirect('/dashboard');
    }
  } catch (error) {
    res.status(400).json({
      result: "error"
    })
  }
}

/** Result vote
 * @name resultvote
 * @memberof module:controllers/index
 * @param {object} req
 * @param {object} res
 */
controller.resultvote = async (req, res)=>{
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
  }

  res.render('./resultat', {
    title: "Résultat de vote",
    subject: subject,
    resultat: result,
    totaloptions: totalOptions,
    path: '/dashboard/resultat'
  })
}

module.exports = controller;