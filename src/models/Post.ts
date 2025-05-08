import mongoose, { model, Model, Schema, Types } from "mongoose";

interface IPost {
    body: string;
    author: Types.ObjectId;
    createdAt: Date;
}

const postSchema = new Schema<IPost>({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
});

const Post =
    (mongoose.models?.Post as Model<IPost>) || model<IPost>("Post", postSchema);

export default Post;
export type { IPost };
