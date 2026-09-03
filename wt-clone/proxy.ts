// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// export function proxy(request: NextRequest) {
//     console.log("PATH:", request.nextUrl.pathname);
//     console.log("COOKIES:", request.cookies.getAll());
//     console.log("TOKEN:", request.cookies.get("Token")?.value);

//     const path = request.nextUrl.pathname;
//     const publicPath = ["/login"];

//     const token = request.cookies.get("Token")?.value || "";

//     if (publicPath.includes(path)) {
//         return NextResponse.next();
//     }

//     if (!token) {
//         return NextResponse.redirect(
//             new URL("/login", request.url)
//         );
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/login", "/", "/profile"],
// };