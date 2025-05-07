import { getMe } from "@/lib/auth/me";

export default async function Me() {
    const me = (await getMe())!;
}
