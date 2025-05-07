import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
    title: "CoffeeTox",
    description: "Nirvana ♪ streaming service",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/coffee_terraria.png" sizes="any" />
            </head>
            <body className="">
                <SiteHeader />
                <div className="w-full p-2">{children}</div>
            </body>
        </html>
    );
}
