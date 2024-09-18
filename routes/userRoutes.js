import {
  addFavorite,
  authUser,
  deleteFavorite,
  getFavorites,
  getUserProfile,
  logoutUser,
  registerUser,
  updateUserProfile,
} from '../controllers/userController.js';

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/favorites').get(protect, getFavorites).post(protect, addFavorite);
router.route('/favorites/:id').delete(protect, deleteFavorite);
export default router;
