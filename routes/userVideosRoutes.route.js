

import express from 'express';
import { getVideosByUser } from '../controllers/video.controller.js';

const router = express.Router();

router.route('/:userId/videos').get(getVideosByUser);

export default router;