"use server";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "./lib/auth/session";
import { UserRole } from "@/models/User";
import { getMe } from "./lib/auth/me";

const authProtectedRoutes = ["/auth/me"];
const adminProtectedRoutes = ["/auth/all_users"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isAuthProtectedRoute = authProtectedRoutes.includes(path);
    const isAdminProtectedRoute = adminProtectedRoutes.includes(path);
    const session = await getCurrentSession();

    if (isAuthProtectedRoute && session === null) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }

    if (
        isAdminProtectedRoute &&
        (session === null || session.userRole !== UserRole.ADMIN)
    ) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }

    return NextResponse.next();
}
