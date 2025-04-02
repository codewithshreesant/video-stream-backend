import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
import streamifier from 'streamifier';

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Replace with your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
});

// Function to Upload File to Cloudinary
const uploadToCloudinary = (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileBuffer, options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};
export {
    uploadToCloudinary
}

// // Example Usage
// (async () => {
//   try {
//     const imageUrl = await uploadToCloudinary('path/to/your/image.jpg', 'your-folder-name');
//     console.log('Uploaded Image URL:', imageUrl);
//   } catch (error) {
//     console.error('Failed to upload the file:', error);
//   }
// })();
