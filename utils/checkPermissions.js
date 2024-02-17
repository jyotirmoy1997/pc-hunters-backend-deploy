const CustomError = require("../errors/index")

const checkPermissions = (requestUser, resourceUserId, type) => {
    if(requestUser.role === type)
        return
    
    if(requestUser.userId === resourceUserId.toString())
        return
    
    throw new CustomError.UnauthorizedError("Not Authorized to access this resource")
}



module.exports = checkPermissions