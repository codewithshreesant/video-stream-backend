
import { Router } from 'express'
import { getUserProfile, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verify.middleware.js';

const router = Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').post(verifyToken,logoutUser);

router.route('/profile').get(verifyToken,getUserProfile);


export default router;