import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { getGridFSFile } from "@/lib/fs";
import { promises as fs } from "fs";
import User from "@/models/User";

const N_DEFAULT_AVATARS = 11;
const DEFAULT_AVATARS_EXT = "png";

async function sendDefaultAvatar(userId: mongoose.Types.ObjectId) {
    const index =
        Array.from(userId.toString()).reduce(
            (val, ch) => ch.charCodeAt(0) + val,
            0
        ) % N_DEFAULT_AVATARS;

    const def = await fs.readFile(
        process.cwd() + `/public/defaultAvatars/${index}.${DEFAULT_AVATARS_EXT}`
    );
    return new Response(def.buffer, {
        headers: {
            "Content-Type": `image/${DEFAULT_AVATARS_EXT}`,
        },
        status: 200,
    });
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId: idRaw } = await params;

    if (!mongoose.Types.ObjectId.isValid(idRaw)) {
        return Response.json(
            {
                error: "Invalid id format",
            },
            {
                status: 400,
            }
        );
    }

    const objectId = new mongoose.Types.ObjectId(idRaw);
    const user = await User.findById(objectId);

    if (user === null) {
        return Response.json(
            {
                error: "User does not exist",
            },
            { status: 404 }
        );
    } else if (user.avatar === null) {
        return await sendDefaultAvatar(user._id);
    }

    const { file, buffer } = await getGridFSFile(user.avatar);

    if (file === null) {
        return await sendDefaultAvatar(user._id);
    }

    return new Response(buffer, {
        headers: {
            "Content-Type": file.metadata?.contentType,
        },
        status: 200,
    });
}
