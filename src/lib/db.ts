import mongoose, { mongo } from "mongoose";

declare global {
    var mongoose: any;
}

type CacheType = {
    conn: mongoose.mongo.Db;
    promise: Promise<any>;
    gridFSBucket: mongoose.mongo.GridFSBucket;
};

const options = {};
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
        gridFSBucket: null,
    };
}

async function dbConnect(): Promise<CacheType> {
    const MONGODB_URI = process.env.MONGODB_URI!;

    if (!MONGODB_URI) {
        throw new Error(
            "Please define the MONGODB_URI environment variable inside .env.local"
        );
    }

    if (cached.conn) {
        return cached;
    }
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, options)
            .then((mongoose) => {
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
        cached.gridFSBucket = new mongoose.mongo.GridFSBucket(
            cached.conn.connection.db,
            {
                bucketName: "user_files",
            }
        );
    } catch (e) {
        cached.conn = null;
        cached.promise = null;
        throw e;
    }

    return cached;
}

dbConnect();

/*
mongoose.Schema.ObjectId.get((v) => {
    if (v instanceof mongoose.mongo.ObjectId) return v.toString();
    return v;
});
mongoose.Schema.Types.Date.get((v) => {
    return v.toISOString();
});
mongoose.set("toJSON", { getters: true });
mongoose.set("toObject", { getters: true });

*/

export default dbConnect;
