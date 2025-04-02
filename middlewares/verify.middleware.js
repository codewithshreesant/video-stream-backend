import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    console.log("token ", token);
    console.log('--- /api/comments/videos/ Request Received ---');
    console.log('Request Headers:', req.headers);
    console.log('req.headers.cookie:', req.headers.cookie);
    console.log('req.cookies (after cookieParser):', req.cookies);
    console.log('Trying to access req.cookies.token:', req.cookies?.token);
    console.log('--- End of Logging ---');


    if (!token) {
      return res.status(401).json({ "error": "Unauthorized - Token not found" });
    }

    let userInfo;
    try {
      userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (jwtError) {
      return res.status(401).json({ "error": "Unauthorized - Invalid Token" });
    }
    console.log("user info ", userInfo);
    const user = await User.findById(userInfo?.userId);
    console.log("user ", user);

    if (!user) {
      return res.status(401).json({ "error": "Unauthorized - Invalid User" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ "error": "Internal Server Error - Token verification failed" });
  }
};

export { verifyToken };   