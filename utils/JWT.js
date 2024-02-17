const JWT = require("jsonwebtoken")
require("dotenv").config()

const createJWT = ({payload}) => {
    const token = JWT.sign(
        payload, 
        process.env.JWT_SECRET, 
        {expiresIn : process.env.JWT_LIFETIME})
    return token
}

const attachCookiesToResponse = (res, user) => {
    const token = createJWT({payload: user})
    
    const eightHours = 1000 * 60 * 60 * 8
    res.cookie('token', token, {
        httpOnly : true,
        expires : new Date(Date.now() + eightHours),
        secure : process.env.NODE_ENV === 'Production',
        signed : true,
    })
}

const isTokenValid = (token) => JWT.verify(token, process.env.JWT_SECRET)

module.exports = {createJWT, isTokenValid, attachCookiesToResponse}