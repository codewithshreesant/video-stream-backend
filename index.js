import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './dbConfig/index.js';
import videoRoutes from './routes/video.route.js';
import userVideoRoutes from './routes/userVideosRoutes.route.js';
import userRoutes from './routes/user.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import commentRoutes from './routes/comment.route.js';
import reactionRoutes from './routes/reaction.route.js'
import { verifyToken } from './middlewares/verify.middleware.js';
import userVideo from './routes/userVideosRoutes.route.js'
import adminRoutes from './routes/admin.route.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));
app.use(cookieParser());

app.use('/api/comments', commentRoutes); 
app.use('/api/videos', videoRoutes);
app.use('/api/users', userVideoRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uservideo', userVideo);
app.use('/api/admin', adminRoutes);

connectDB()
.then(
()=>{
    app.listen(PORT, ()=>{
        console.log(`The server is listening at PORT ${PORT}`);
    })
}
)
.catch(error=>console.log(`ERROR occured while connecting to database `));