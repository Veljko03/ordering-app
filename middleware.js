import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  console.log("Session: ", session);

  const isProtected = path.startsWith("/admin");
  const log = path.startsWith("/login");

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (log && session) {
    return NextResponse.redirect(new URL("/admin/buisnessInfo", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"], //ovde stavljam da se middlware pokrece samo na ove rute 
};
