import Link from "next/link";
import Image from "next/image";
import { getMe } from "@/lib/auth/me";
import { logout } from "@/lib/auth/actions";

export default async function SiteHeader() {
    const me = await getMe();

    return (
        <div className="w-full bg-gray-200 flex justify-between px-2 py-1">
            <Link href="/">
                <div className="flex items-center gap-0.5">
                    <Image
                        src="/coffee_terraria.png"
                        alt="cfx_logo"
                        width={20}
                        height={20}
                    />
                    tox
                </div>
            </Link>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
            </ul>
            <div>
                {me === null && <Link href="/auth/login">Login</Link>}
                {me !== null && (
                    <>
                        <p>@{me.tag}</p>
                        <button onClick={logout}>Logout</button>
                    </>
                )}
            </div>
        </div>
    );
}
