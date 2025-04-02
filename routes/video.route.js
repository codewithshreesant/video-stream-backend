

import express from 'express';
import {
  uploadVideo,
  getAllPublicVideos,
  getVideoById,
  updateVideo,
  incrementVideoViews,
  deleteVideo,
  getSingleVideo,
} from '../controllers/video.controller.js';

import { upload } from '../helper/multer.js'; 
import { verifyToken } from '../middlewares/verify.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(getAllPublicVideos)
  .post(
    verifyToken,
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
    uploadVideo
  ); 
  router.route('/:videoId').get(getSingleVideo) 
router
  .route('/:id')
  .get(getVideoById)
  .put(updateVideo)
  .delete(deleteVideo);

router.route('/:id/views').put(incrementVideoViews);

export default router;