const mongoose=require("mongoose");
const Vote = require("../models/vote");

/** Controller VOTE
 * @module controllers/vote
 * @requires mongoose
 */

//Set up default mongoose connection
// var mongoDB = 'mongodb://localhost:27017/simplon-vote';
// var ObjectId=mongoose.Types.ObjectId;
// mongoose.connect(mongoDB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

var controller={}

/** 
 * List all votes
 * @name list
 * @memberof module:controllers/vote
 * @function
 * @returns {json} votes
 */
controller.list = async (req,res) => {
  const votes = await Vote.find({})
  try {
    res.status(200).json({votes})
  } catch (error) {
    res.status(400).json({result: "error"})
  }
}

/** Add one vote
 * @name add
 * @memberof module:controllers/vote
 * @function
 * @param {string} subject
 * @param {integer} quota
 * @param {array} choices
 * @param {integer} nbVote
 * @param {OjectId} createdBy
 * @param {array} participants
 * @param {string} status ['created', 'inprogress', 'finished']
 * @returns {json} vote
 */
controller.add = async (req,res) => {
  const {subject, quota, choices, nbVote, createdBy, participants, status} = req.body
  try {
    const vote = await Vote.create({
      subject,
      quota,
      choices,
      nbVote,
      createdBy,
      participants,
      status
    })
    res.status(201).json({vote})
  } catch (error) {
    res.status(400).json({result:"error"})
  }
}

/** Show one vote
 * @name show
 * @memberof module:controllers/vote
 * @function
 * @returns {json} vote
 */
controller.show = async (req,res) => {
  const {id} = req.params
  try {
    const vote = await Vote.findById(id)
    if (!vote) return res.status(400).json({result: "error", message: "vote non trouvé"})
    res.status(200).json({vote})
  } catch (error) {
    res.status(400).json({result: "error", message: error})
  }
}

/** Update one vote
 * @name update
 * @memberof module:controllers/vote
 * @function
 * @param {string} subject
 * @param {integer} quota
 * @param {array} choices
 * @param {integer} nbVote
 * @param {OjectId} createdBy
 * @param {array} participants
 * @param {string} status ['created', 'inprogress', 'finished']
 * @returns {json} vote
 */
controller.update = async (req,res) => {
  const { id } = req.params
  const {subject, quota, choices, nbVote, createdBy, participants, status} = req.body
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
    res.status(200).json({vote})
  } catch (error) {
    res.status(400).json({result:"error"})
  }
}

/** delete one vote
 * @name delete
 * @memberof module:controllers/vote
 */
controller.delete = async (req, res) => {
  try {
    const { id } = req.params
    await Vote.findByIdAndRemove(id)
    res.status()
    res.status(200).json({result:"success", message: "vote supprimé"})
  } catch (error) {
    res.status(400).json({result:"error"})
  }
}




// controller.list = async (req,res) => {
//     const votes = await Vote.find({})
//     res.status(200).json({
//         result: 
//         votes
//     })
// }
// controller.ajout = async (req,res) => {
//   res.status(201).json({
//     user
//   })
// }

// controller.addvote = (req,res)=>{
 
// }
// controller.detailvote=(req,res)=>{
 
// }
        

// controller.updatevote=(req,res)=>{
       
// }

// controller.deletevote=(req,res)=>{
       
// }

module.exports =controller;