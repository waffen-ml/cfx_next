"use server";

import { z } from "zod";
import dbConnect from "../db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { createSession, deleteCurrentSession } from "./session";
import { redirect } from "next/navigation";

/*
const loginSchema = z.object({
    tag: z
        .string()
        .trim()
        .min(4, "At least 4 characters")
        .max(30, "At most 30 characters"),
    password: z.string().trim().min(4, "At least 4 characters"),
});

const registerSchema = loginSchema
    .extend({
        name: z.string().trim(),
        confirmPassword: z.string(),
        email: z.string().trim(), //.email(),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        "Password are not the same"
    );

*/

const loginSchema = z.object({
    tag: z.string(),
    password: z.string(),
});

const registerSchema = loginSchema.extend({
    name: z.string(),
    confirmPassword: z.string(),
    email: z.string(),
});

export type LoginFields = z.infer<typeof loginSchema>;
export type RegisterFields = z.infer<typeof registerSchema>;

export async function login(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    await dbConnect();

    const { tag, password } = result.data;
    const user = await User.findByTag(tag);

    if (user === null || !(await bcrypt.compare(password, user.passwordHash))) {
        return {
            errors: {
                tag: ["Invalid tag or password"],
            },
        };
    }

    await createSession({
        userId: user.id,
        userRole: user.role,
    });

    redirect("/");
}

export async function register(prevState: any, formData: FormData) {
    const result = registerSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    await dbConnect();

    const { name, tag, email, password } = result.data;

    const found = await User.findByTag(tag);

    if (found !== null) {
        return {
            errors: {
                tag: ["This tag is already in use"],
            },
        };
    }

    const user = await User.create({
        name,
        tag,
        email,
        passwordHash: await bcrypt.hash(password, 10),
    });

    await createSession({
        userId: user._id.toString(),
        userRole: user.role,
    });

    redirect("/");
}

export async function logout() {
    await deleteCurrentSession();
    //redirect("/auth/login");
}
