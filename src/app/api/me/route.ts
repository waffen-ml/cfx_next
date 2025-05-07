import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decryptSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
    const cookie = (await cookies()).get("session")?.value;
    const session = cookie === undefined ? null : decryptSession(cookie);

    if (session === null) {
        return Response.json({ error: "cookie not found" });
    }

    return Response.json({ session });
}
