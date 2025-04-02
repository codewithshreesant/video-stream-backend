import express from 'express';
const router = express.Router();
import {
    createComment,
    getCommentsByVideoId,
    updateComment,
    deleteComment,
    getCommentById,
    getAllComments,
} from '../controllers/comment.controller.js'; 
import { verifyToken } from '../middlewares/verify.middleware.js';

router.post('/videos/:videoId/comments', verifyToken, createComment);

router.get('/videos/:videoId/comments', getCommentsByVideoId);

router.get('/comments/:commentId', getCommentById);

router.get('/comments', getAllComments);

router.put('/comments/:commentId', verifyToken, updateComment);

router.delete('/comments/:commentId', verifyToken, deleteComment);

export default router;