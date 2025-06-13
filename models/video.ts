import mongoose, { Schema, model,models, Document, HydratedDocument } from "mongoose";

export const VIDEODIMENSIONS = {
    width: 180,
    height: 1920,
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
  title: string;    
    description: string;        
    videoUrl: string;
    thumbnailUrl: string;
    control?:boolean;
    transformation?: {
        width?: number;
        height?: number;
        quality?: number;
    }
}
const videoSchema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        control: { type: Boolean, default: true },
        transformation: {
            width: { type: Number, default: VIDEODIMENSIONS.width },
            height: { type: Number, default: VIDEODIMENSIONS.height },
            quality: { type: Number, min: 1, max: 100, default: 75 },
        },
    },
    { timestamps: true }
);
const Video = models?.video || model<IVideo>("Video", videoSchema);
export default Video;
