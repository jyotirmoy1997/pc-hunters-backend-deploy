const User = require("../model/User")
const {StatusCodes} = require("http-status-codes")

const getAllUsers = async (req, res) => {
    const users = await User.find({role : 'user'}).select('-password')
    res.status(StatusCodes.OK).json(users)
}


module.exports = {
    getAllUsers,
}