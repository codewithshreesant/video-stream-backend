// reaction.route.js
import { Router } from 'express';
import {
    addReaction,
    removeReaction,
    getReactionsForVideo,
    getReactionByUserAndVideo,
    getAllReactions,
} from '../controllers/reaction.controller.js';
import { verifyToken } from '../middlewares/verify.middleware.js';

const router = Router();
router.route('/videos/:videoId').post(verifyToken, addReaction);

router.route('/videos/:videoId').delete(verifyToken, removeReaction);

router.route('/reactions').get(getAllReactions);

router.route('/videos/:videoId').get(getReactionsForVideo);

router.route('/videos/:videoId/user').get(verifyToken, getReactionByUserAndVideo);

export default router;