import { getCurrentSession } from "@/lib/auth/session";
import User from "@/models/User";

export async function getMyId() {
    const session = await getCurrentSession();
    return session === null ? null : session.userId;
}

export async function getMe() {
    const userId = await getMyId();

    if (userId === null) return null;

    const user = await User.findById(userId);
    return user;
}
