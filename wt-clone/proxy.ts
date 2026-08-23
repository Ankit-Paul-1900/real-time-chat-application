import {NextResponse} from "next/server";
import {NextRequest} from "next/server";

export function proxy(request:NextRequest){
    const path=request.nextUrl.pathname;
    const publicPath=["/login"];
    const token= request.cookies.get("Token")?.value ||"";
     if (publicPath.includes(path)){
        return NextResponse.next()
     }
    if (!publicPath.includes(path) && !token){
        return NextResponse.redirect(new URL("/login",request.nextUrl))
    }
    
}
export const config = {
  matcher: ['/login','/','/profile'],
}
