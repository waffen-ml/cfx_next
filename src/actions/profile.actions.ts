"use server";

import { z } from "zod";
import { convertFileToImage } from "@/lib/utils";
import dbConnect from "@/lib/db";
import { getMe } from "@/lib/auth/me";
import User from "@/models/User";

const MAX_AVATAR_FILE_SIZE = 1024 * 1024 * 5; // bytes
const ACCEPTED_AVATAR_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_AVATAR_WIDTH = 400;
const MIN_AVATAR_WIDTH = 100;

const avatarSchema = z
    .instanceof(File, { message: "Avatar should be a file" })
    .superRefine((file, ctx) => {
        if (!ACCEPTED_AVATAR_FILE_TYPES.includes(file.type)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please choose a JPG or PNG file",
                fatal: true,
            });
            return z.NEVER;
        }

        if (file.size > MAX_AVATAR_FILE_SIZE) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Max avatar file size is 5MB",
                fatal: true,
            });
            return z.NEVER;
        }
    })
    .refine(
        (file) =>
            convertFileToImage(file).then(
                (img) =>
                    MIN_AVATAR_WIDTH <= img.width &&
                    img.width <= MAX_AVATAR_WIDTH &&
                    img.width === img.height
            ),
        `The image dimensions are invalid. It should be 1:1 and have width between ${MIN_AVATAR_WIDTH} and ${MAX_AVATAR_WIDTH} px.`
    );

export async function setAvatar(prevState: any, formData: unknown) {
    if (!(formData instanceof FormData)) {
        return {
            errors: ["Invalid format"],
        };
    }

    const me = await getMe();

    if (me === null) {
        return {
            errors: ["It is required to be authenticated"],
        };
    }

    const avatar = formData.get("avatar");
    const result = await avatarSchema.safeParseAsync(avatar);

    if (!result.success) {
        return {
            errors: result.error.flatten().formErrors,
        };
    }

    const file = result.data;
    const { gridFSBucket } = await dbConnect();
    const writeStream = gridFSBucket.openUploadStream(file.name, {
        metadata: { contentType: file.type },
    });

    writeStream.write(Buffer.from(await file.arrayBuffer()));
    writeStream.end();

    me.avatar = writeStream.id;

    await me.save();

    return {
        errors: [],
    };
}

// 681c8f81a41700c4b1bd5dd2
