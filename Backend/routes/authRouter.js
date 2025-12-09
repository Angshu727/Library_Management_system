import express from 'express';
import { forgotPassword, getUserDetails, login, logout, register, verifyOTP } from '../controllers/authController.js';
import { isAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',register);
router.post('/verify-otp',verifyOTP);
router.post('/login',login);
router.get('/logout',isAuthenticatedUser,logout);
router.get('/me',isAuthenticatedUser,getUserDetails);
router.post('/password/forgot',forgotPassword);

export default router;