import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    //also res.cookie was set in generateToken method so response is cookie+body below
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
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
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'User logged out' });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  };

  res.status(200).json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json(user.favorites || []);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const addFavorite = asyncHandler(async (req, res) => {
  const { id, alt, photographer, src } = req.body;

  const parsedSrc = JSON.parse(src);

  const user = await User.findById(req.user._id);

  if (user) {
    const alreadyFavorited = user.favorites.some((fav) => fav.id === parseInt(id));

    if (alreadyFavorited) {
      res.status(400);
      throw new Error('Image is already in favorites');
    }
    const favorite = { id, alt, photographer, src: parsedSrc };
    user.favorites.push(favorite);

    await user.save();
    res.status(201).json(favorite);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const deleteFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { id } = req.params;

  if (user) {
    const updatedFavorites = user.favorites.filter((fav) => fav.id !== parseInt(id));

    if (updatedFavorites.length === user.favorites.length) {
      res.status(404);
      throw new Error('Image not found in favorites');
    }

    user.favorites = updatedFavorites;
    await user.save();

    res.status(200).json({ message: 'Favorite image removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getFavorites,
  addFavorite,
  deleteFavorite,
};
