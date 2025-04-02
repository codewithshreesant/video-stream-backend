
import { asyncHandler } from "../utils/asyncHandler.js";
import { Reaction } from "../models/reaction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addReaction = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { reactionType } = req.body;
    const user = req.user._id; 

    if (!reactionType || !['like', 'dislike', 'heart', 'laugh', 'sad', 'angry'].includes(reactionType)) {
        throw new ApiError(400, "Invalid reaction type");
    }

    const existingReaction = await Reaction.findOne({ video: videoId, user });

    if (existingReaction) {
        existingReaction.reactionType = reactionType;
        await existingReaction.save();
        return res
            .status(200)
            .json(new ApiResponse(200, existingReaction, "Reaction updated"));
    }

    const newReaction = await Reaction.create({
        video: videoId,
        user,
        reactionType,
    });

    if (!newReaction) {
        throw new ApiError(500, "Failed to add reaction");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newReaction, "Reaction added successfully"));
});

const removeReaction = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const user = req.user._id;

    const deletedReaction = await Reaction.findOneAndDelete({ video: videoId, user });

    if (!deletedReaction) {
        throw new ApiError(404, "Reaction not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Reaction removed successfully"));
});

const getReactionsForVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const reactions = await Reaction.find({ video: videoId });

    return res
        .status(200)
        .json(new ApiResponse(200, reactions, "Reactions for video fetched successfully"));
});

const getReactionByUserAndVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const user = req.user._id;

    const reaction = await Reaction.findOne({ video: videoId, user });

    if (!reaction) {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "No reaction found for this user and video"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, reaction, "User's reaction fetched successfully"));
});

const getAllReactions = asyncHandler(
    async(req,res,next)=>{
        const reactions = await Reaction.find({}).populate('user', 'video');
        res.json(reactions);
    }
)

export {
    addReaction,
    removeReaction,
    getReactionsForVideo,
    getReactionByUserAndVideo,
    getAllReactions
};