// reaction.model.js
import mongoose, { Schema } from "mongoose";

const reactionSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: 'Video', // Assuming you have a Video model
            required: true,
            index: true, // For efficient querying
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Assuming you have a User model
            required: true,
        },
        reactionType: {
            type: String,
            enum: ['like', 'dislike', 'heart', 'laugh', 'sad', 'angry'], // Define possible reaction types
            required: true,
        },
    },
    { timestamps: true }
);

// Prevent duplicate reactions by the same user on the same video
reactionSchema.index({ video: 1, user: 1 }, { unique: true });

export const Reaction = mongoose.model("Reaction", reactionSchema);