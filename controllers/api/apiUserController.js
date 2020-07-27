const User       = require('../../models/users');

/** Controller USER
 * @module controllers/apiUser
 * @requires mongoose
 */

/** List all users
* @name list
* @memberof module:controllers/apiUser
* @function
* @returns {json} users
* @throws {json} send JSON with error
*/
exports.list = async (req, res) => {
    try {
        const users = await User.find().select('login email');
        res.status(200).json({
            users
        });
    } catch (error) {
        res.status(400).json({
            result: "error"
        });
    }
};

/** Show one user
 * @name show
 * @memberof module:controllers/apiUser
 * @function
 * @returns {json} user
 * @throws {json} send JSON with error
 */
exports.show = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id).select('login email');
        if (!user) {
            return res.status(400).json({
                result: "error",
                message: "utilisateur non trouvé"
            });
        };
        res.status(200).json({
            user
        });
    } catch (error) {
        res.status(400).json({
            result: "error",
            message: error
        });
    }
};