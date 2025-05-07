"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserRole } from "@/models/User";

const secretKey = process.env.SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
    userId: string;
    userRole: UserRole;
};

export async function encryptSession(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decryptSession(session: string) {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload as SessionPayload;
    } catch (error) {
        console.log("Failed to verify the session", error);
        return null;
    }
}

export async function createSession(payload: SessionPayload) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encryptSession(payload);

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: false,
        expires: expiresAt,
    });
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
    const cookie = (await cookies()).get("session")?.value;
    const session = cookie === undefined ? null : await decryptSession(cookie);
    return session;
}

export async function deleteCurrentSession() {
    (await cookies()).delete("session");
}
