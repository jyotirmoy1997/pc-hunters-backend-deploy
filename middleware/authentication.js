const { isTokenValid } = require('../utils/JWT');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new Error('Authentication Invalid');
  }
  try {
    const { name, userId, role } = isTokenValid(token);
    req.user = { name, userId, role };
    
  } catch (error) {
    return res.status(401).json("Un-Authorized")
  }
  next();
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json("Un-Authorized")
    }
    console.log("Admin Hit")
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
