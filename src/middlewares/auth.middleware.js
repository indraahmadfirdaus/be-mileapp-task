const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided, authorization denied', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'No token provided, authorization denied', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', 401);
    }
    return errorResponse(res, 'Token verification failed', 401);
  }
};

module.exports = authMiddleware;