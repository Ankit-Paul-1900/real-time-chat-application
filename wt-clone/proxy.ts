import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    console.log("PATH:", request.nextUrl.pathname);
    console.log("COOKIES:", request.cookies.getAll());
    console.log("TOKEN:", request.cookies.get("Token")?.value);

    return NextResponse.next();
}
