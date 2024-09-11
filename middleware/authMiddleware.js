import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      // TODO:remove this
      throw error;
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
  } else {
    throw new Error('Not authorized, no token');
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
