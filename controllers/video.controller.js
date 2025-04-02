import { Video } from '../models/video.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadToCloudinary } from '../helper/cloudinary.js';
import fs from 'fs/promises';

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, privacy } = req.body;
  const videoFile = req.files?.video?.[0]?.path;
  const thumbnailFile = req.files?.thumbnail?.[0]?.path;
  const uploader = req.user?._id;
  console.log("video file ", videoFile);
  console.log("image file  ", thumbnailFile);

  if (!title || !videoFile || !thumbnailFile || !uploader) {
    if (videoFile) {
      await fs.unlink(videoFile).catch(() => {});
    }
    if (thumbnailFile) {
      await fs.unlink(thumbnailFile).catch(() => {});
    }
    return res
      .status(400)
      .json(new ApiResponse(400, 'Missing required fields'));
  }

  try {
    const videoResult = await uploadToCloudinary(videoFile, {
      resource_type: 'video',
      folder: 'videos',
    });

    const thumbnailResult = await uploadToCloudinary(thumbnailFile, {
      folder: 'thumbnails',
    });

    if (!videoResult?.url || !thumbnailResult?.url) {
      if (videoResult?.public_id) {
        await cloudinary.uploader.destroy(videoResult.public_id, { resource_type: 'video' }).catch(() => {});
      }
      if (thumbnailResult?.public_id) {
        await cloudinary.uploader.destroy(thumbnailResult.public_id).catch(() => {});
      }
      return res
        .status(500)
        .json(new ApiResponse(500, 'Failed to upload video or thumbnail to Cloudinary'));
    }

    const video = await Video.create({
      title,
      description,
      filePath: videoResult.secure_url, 
      thumbnailPath: thumbnailResult.secure_url, 
      uploader,
      privacy: privacy || 'public',
    });

    await fs.unlink(videoFile).catch(() => {});
    await fs.unlink(thumbnailFile).catch(() => {});

    res
      .status(201)
      .json(new ApiResponse(201, 'Video uploaded successfully', video));
  } catch (error) {
    console.error('Error during video upload:', error);

    if (videoFile) {
      await fs.unlink(videoFile).catch(() => {});
    }
    if (thumbnailFile) {
      await fs.unlink(thumbnailFile).catch(() => {});
    }

    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          'Failed to upload video',
          { message: error.message, details: error } // Include more error details
        )
      );
  }
});

const getAllPublicVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ privacy: 'public' }).populate('uploader', 'username'); // Populate uploader's username.
  res
    .status(200)
    .json(new ApiResponse(200, 'Public videos retrieved', videos));
});

const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id).populate('uploader', 'username');
  if (!video) {
    return res.status(404).json(new ApiResponse(404, 'Video not found'));
  }
  res.status(200).json(new ApiResponse(200, 'Video retrieved', video));
});


const getVideosByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if(!user){
    return res.status(404).json(new ApiResponse(404, "User not found"))
  }

  const videos = await Video.find({ uploader: userId }).populate('uploader', 'username');
  res
    .status(200)
    .json(new ApiResponse(200, 'User videos retrieved', videos));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { title, description, privacy } = req.body;
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { title, description, privacy, updatedAt: Date.now() },
    { new: true }
  );

  if (!video) {
    return res.status(404).json(new ApiResponse(404, 'Video not found'));
  }

  res.status(200).json(new ApiResponse(200, 'Video updated', video));
});

const incrementVideoViews = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) {
    return res.status(404).json(new ApiResponse(404, 'Video not found'));
  }

  res.status(200).json(new ApiResponse(200, 'View count incremented', video));
});

const getSingleVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;

  if (!videoId) {
    return res.status(400).json(new ApiResponse(400, 'Video ID is required'));
  }

  try {
    const video = await Video.findById(videoId).populate('uploader', 'username _id'); 
    if (!video) {
      return res.status(404).json(new ApiResponse(404, 'Video not found'));
    }

    res.status(200).json(new ApiResponse(200, 'Video retrieved successfully', video));
  } catch (error) {
    console.error('Error fetching single video:', error);
    res.status(500).json(new ApiResponse(500, 'Failed to retrieve video', error?.message || 'Something went wrong'));
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json(new ApiResponse(404, 'Video not found'));
  }

  try {
    if (video.cloudinaryVideoId) {
      await cloudinary.uploader.destroy(video.cloudinaryVideoId, { resource_type: 'video' });
    }
    if (video.cloudinaryThumbnailId) {
      await cloudinary.uploader.destroy(video.cloudinaryThumbnailId);
    }
    await Video.findByIdAndDelete(videoId);

    res.status(200).json(new ApiResponse(200, 'Video deleted successfully'));
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json(new ApiResponse(500, 'Failed to delete video', error?.message || 'Something went wrong'));
  }
});

export {
  uploadVideo,
  getAllPublicVideos,
  getVideoById,
  getVideosByUser,
  updateVideo,
  incrementVideoViews,
  deleteVideo,
  getSingleVideo
};