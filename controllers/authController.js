const User = require("../model/User")
const {StatusCodes} = require("http-status-codes")
const {attachCookiesToResponse} = require("../utils/JWT")
const createTokenUser = require("../utils/createTokenUser")

const register = async (req, res) => {
    const {name, email, password} = req.body
    // console.log(name, email, password)
    const isDuplicateEmail = await User.findOne({email})
    const newUser = {
        name,
        email,
        password
    }

    // If the email is already in use, then we invoke an error
    if(isDuplicateEmail){
        return res.status(StatusCodes.BAD_REQUEST).json({msg : "User already Exists"})
    }

    // If user is the first user, then the role is set to admin
    const firstUser = (await User.countDocuments({})) === 0
    if(firstUser){
        newUser.role = "admin"
    }
    const user = await User.create(newUser)

    // Creating a token user
    const tokenUser = createTokenUser(user)

    attachCookiesToResponse(res, tokenUser)
    res.status(StatusCodes.CREATED).json({user : tokenUser})
}

const login = async (req, res) => {
    const {email, password} = req.body
    console.log(email, password)
    const user = await User.findOne({email : email})
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({msg : "User doesn't exist"})
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        return res.status(StatusCodes.BAD_REQUEST).json({msg : "Wrong Password"})
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse(res, tokenUser)
    console.log("Cookie :: ", res.cookie)
    res.status(200).json(tokenUser)
}

const logout = (req, res) => {
    // In Logout stage, we remove the cookie
    res.cookie('token', 'logout', {
        httpOnly : true,
        expires : new Date(Date.now())
    })
    res.send("Logged Out")
}

module.exports = {register, login, logout}