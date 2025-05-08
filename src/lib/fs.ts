import mongoose from "mongoose";
import dbConnect from "./db";

export async function getGridFSFile(
    objectId: mongoose.Types.ObjectId
): Promise<{ file: mongoose.mongo.GridFSFile | null; buffer: Buffer | null }> {
    const { gridFSBucket } = await dbConnect();
    const files = await gridFSBucket.find({ _id: objectId }).toArray();

    if (files.length === 0) return { file: null, buffer: null };

    const file = files[0];
    const downloadStream = gridFSBucket.openDownloadStream(file._id);

    const buffers = [];

    for await (const data of downloadStream) {
        buffers.push(data);
    }

    return {
        file,
        buffer: Buffer.concat(buffers),
    };
}
