import mongoose, { model, Model, Schema, ObjectId } from "mongoose";

interface IPost {
    body: string;
    authorId: ObjectId;
    createdAt: Date;
}

const postSchema = new Schema<IPost>({
    body: String,
    authorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

const Post =
    (mongoose.models?.Post as Model<IPost>) || model<IPost>("Post", postSchema);

export default Post;
