"use server";

import { revalidatePath } from "next/cache";
import { getMe, getMyId } from "../auth/me";
import { simplifyObject } from "../utils";
import Post, { IPost } from "@/models/Post";

const FEED_BATCH_SIZE = 4;

export async function createNewPost(formData: FormData) {
    const body = formData.get("body");
    const author = await getMe();

    if (author === null) {
        return;
    }

    const post = await Post.create({
        author: author._id,
        body,
    });

    revalidatePath(`/user/${author.tag}`);
}

export async function getFeed(
    userId: string,
    pageParam: number
): Promise<{
    data: any;
    currentPage: number;
    nextPage: number | null;
}> {
    // unsecure

    const posts = await Post.find({ author: userId })
        .sort({ createdAt: -1 })
        .skip(pageParam * FEED_BATCH_SIZE)
        .limit(FEED_BATCH_SIZE)
        .populate("author")
        .lean();

    return {
        data: simplifyObject(posts),
        currentPage: pageParam,
        nextPage: posts.length == FEED_BATCH_SIZE ? pageParam + 1 : null,
    };
}
