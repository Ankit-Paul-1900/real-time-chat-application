import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const publicPath = ["/login"];

    const isLoggedIn =
        request.cookies.get("isLoggedIn")?.value === "true";

    if (publicPath.includes(path)) {
        return NextResponse.next();
    }

    if (!isLoggedIn) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/", "/profile"],
};