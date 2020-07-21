const Vote       = require('../../models/votes');

/** Controller VOTE
 * @module controllers/apiVotes
 * @requires mongoose
 */

/** 
* List all votes
* @name list
* @memberof module:controllers/apiVotes
* @function
* @returns {json} votes
*/
exports.list = async (req, res) => {
    try {
        const votes = await Vote.find({}).populate({ path: 'createdBy', select: 'login -_id' }).exec();
        res.status(200).json({ votes });
    } catch (error) {
        res.status(400).json({ result: "error" });
    }
};

/** Show one vote
 * @name show
 * @memberof module:controllers/apiVotes
 * @function
 * @returns {json} vote
 */
exports.show = async (req, res) => {
    const { id } = req.params;
    try {
        const vote = await Vote.findById(id).populate({ path: 'createdBy', select: 'login -_id' }).exec();
        if (!vote) {
            return res.status(400).json({ 
                result: "error", 
                message: "vote non trouvé" 
            });
        }
        res.status(200).json({ vote });
    } catch (error) {
        res.status(400).json({ result: "error", message: error });
    }
};