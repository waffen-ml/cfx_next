import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import QueryProvider from "@/components/QueryProvider";
import dbConnect from "@/lib/db";

export const metadata: Metadata = {
    title: "CoffeeTox",
    description: "Nirvana ♪ streaming service",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    await dbConnect();

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/coffee_terraria.png" sizes="any" />
            </head>
            <body className="">
                <QueryProvider>
                    <SiteHeader />
                    <div className="w-full p-2">{children}</div>
                </QueryProvider>
            </body>
        </html>
    );
}
