import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

const authUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Auth user' });
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Logout user' });
});

const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Get user profile' });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Update user' });
});

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile };
