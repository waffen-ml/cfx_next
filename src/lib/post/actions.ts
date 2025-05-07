"use server";

import { revalidatePath } from "next/cache";
import { getMe, getMyId } from "../auth/me";
import Post from "@/models/Post";

export async function createNewPost(formData: FormData) {
    const body = formData.get("body");
    const author = await getMe();

    if (author === null) {
        return;
    }

    const post = await Post.create({
        authorId: author.id,
        body,
    });

    revalidatePath(`/user/${author.tag}`);
}
