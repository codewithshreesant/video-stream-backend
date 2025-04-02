import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, // Replace with your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,         // Replace with your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
});

// Function to Upload File to Cloudinary (Handles Buffer Input)
const uploadToCloudinary = (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = streamifier.createReadStream(fileBuffer);
        cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) {
                console.error("Cloudinary Upload Error:", error);
                reject(error);
            } else {
                resolve(result);
            }
        }).end(stream);
    });
};

export {
    uploadToCloudinary
};