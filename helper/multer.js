// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//    cb(null, path.join('public', 'uploads'));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// export const upload = multer({ storage: storage });

// import express from 'express';
// import multer from 'multer';
// import path from 'path';

// // Set up storage configuration
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, path.join('public', 'images')); // Set the upload path to public/images
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`); // Define file naming convention
//   },
// });

// // Initialize the upload middleware
// const upload = multer({ storage });

// export {
//     upload
// }

// // Define a route to handle image uploads
// // app.post('/upload', upload.single('image'), (req, res) => {
// //   try {
// //     res.status(200).send(`Image uploaded successfully: ${req.file.filename}`);
// //   } catch (err) {
// //     res.status(400).send('Image upload failed');
// //   }
// // });

import express from 'express';
import multer from 'multer';
import path from 'path';

// Set up storage configuration for production (using memory storage)
const storage = multer.memoryStorage();

// Initialize the upload middleware
const upload = multer({ storage });

export {
    upload
}

// Example of how you might handle the upload in a route (adjust as needed):
// app.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No image file provided.');
//     }
//
//     // Access the file buffer from req.file.buffer
//     const imageBuffer = req.file.buffer;
//     const originalFilename = req.file.originalname;
//     const mimetype = req.file.mimetype;
//
//     // Now you would upload this buffer directly to your cloud storage (e.g., Cloudinary)
//     // Example using a hypothetical uploadToCloudinary function:
//     const cloudinaryResult = await uploadToCloudinary(imageBuffer, {
//       public_id: `images/${Date.now()}-${originalFilename}`,
//       // Add other Cloudinary options as needed
//     });
//
//     if (cloudinaryResult && cloudinaryResult.secure_url) {
//       res.status(200).send(`Image uploaded successfully to Cloudinary: ${cloudinaryResult.secure_url}`);
//     } else {
//       res.status(500).send('Failed to upload image to Cloudinary.');
//     }
//
//   } catch (err) {
//     console.error('Image upload error:', err);
//     res.status(500).send('Image upload failed.');
//   }
// });