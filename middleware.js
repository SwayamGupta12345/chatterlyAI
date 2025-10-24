import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const jwtToken = request.cookies.get("auth_token")?.value;
  // const nextAuthToken = request.cookies.get("next-auth.session-token")?.value;
  const nextAuthToken = request.cookies.get("next-auth.session-token")?.value || request.cookies/get("__SecureNextAuth.session-token")?.value;

  if(!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // 1️⃣ If you have your custom JWT
  if (jwtToken) {
    try {
      await jwtVerify(jwtToken, secret);
      return NextResponse.next();
    } catch (err) {
      // return NextResponse.redirect(new URL("/", request.url));
      console.error("JWT verification failed:", err.message);
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // 2️⃣ If you're logged in with NextAuth (Google etc.)
  if (nextAuthToken) {
    // Token exists, trust NextAuth
    return NextResponse.next();
  }

  // 3️⃣ Otherwise not authenticated
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/dashboard", "/chat", "/ask-doubt", "/profile"],
};