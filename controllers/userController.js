const mongoose = require("mongoose");
const User = require("../models/user");

/** Controller USER
 * @module controllers/user
 * @requires mongoose
 */

/*
//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/simplon-vote';
var ObjectId=mongoose.Types.ObjectId;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });*/

var controller = {}

/** List all users
 * @name list
 * @memberof module:controllers/user
 * @function
 * @returns {json} users
 */
controller.list = async (req, res) => {
  const users = await User.find({})
  try {
    res.status(200).json({
      users
    })
  } catch (error) {
    res.status(400).json({
      result: "error"
    })
  }
}

/** Add one user
 * @name add
 * @memberof module:controllers/user
 * @param {string} login
 * @param {string} email
 * @param {string} password
 * @returns {json} user
 */
controller.add = async (req, res) => {
  const {
    login,
    email,
    password
  } = req.body
  try {
    const user = await User.create({
      login,
      email,
      password
    })
    res.status(201).json({
      user
    })
  } catch (error) {
    res.status(400).json({
      result: "error"
    })
  }
}

/** Show one user
 * @name show
 * @memberof module:controllers/user
 * @function
 * @returns {json} user
 */
controller.show = async (req, res) => {
  const {
    id
  } = req.params
  try {
    const user = await User.findById(id)
    if (!user) return res.status(400).json({
      result: "error",
      message: "utilisateur non trouvé"
    })
    res.status(200).json({
      user
    })
  } catch (error) {
    res.status(400).json({
      result: "error",
      message: error
    })
  }
}

/** Update one user
 * @name update
 * @memberof module:controllers/user
 * @function
 * @param {string} login
 * @param {string} email
 * @param {string} password
 * @returns {json} user
 */
controller.update = async (req, res) => {
  const {
    id
  } = req.params
  const {
    login,
    email,
    password
  } = req.body
  try {
    const user = await User.findByIdAndUpdate(id, {
        login,
        email,
        password
      })
      .setOptions({
        new: true, // for get the update user
        omitUndefined: true
      })
    res.status(200).json({
      user
    })
  } catch (error) {
    res.status(400).json({
      result: "error"
    })
  }
}

/** Delete one user
 * @name delete
 * @memberof module:controllers/user
 * @function
 */
controller.delete = async (req, res) => {
  try {
    const {
      id
    } = req.params
    await User.findByIdAndRemove(id)
    res.status()
    res.status(200).json({
      result: "success",
      message: "utilisateur supprimé"
    })
  } catch (error) {
    res.status(400).json({
      result: "error"
    })
  }
}

/**
 * @name login
 * @verb POST
 * @memberof module:controllers/user
 * @function
 * @param {object} req
 * @param {string} req.email
 * @param {string} req.password
 * @returns {json} 
 */
controller.login = async (req, res) => {
  const {
    email,
    password
  } = req.body
  if (!email || !password) {
    return res.json({
      result: "error",
      message: "Donnée manquante"
    });
  } else {
    try {
      const user = await User.findOne({
        email: email
      })
      if (!user || (user.email !== email && user.password !== password)) {
        return res.json({
          result: "error",
          message: "Mauvais identifiants"
        });
      } else {
        res.json({
          result: "success",
          user
        });
      }
    } catch (error) {
      return res.json({
        result: "error",
        message: "Mauvais identifiants"
      });
    }
  }
}
controller.signup = (req, res) => {

}
module.exports = controller;