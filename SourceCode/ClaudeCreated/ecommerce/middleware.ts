import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { COOKIE_NAME } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/reviews") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const user = await verifyToken(token);
  if (!user) {
    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }

  const isSellerRoute =
    pathname.startsWith("/seller/") ||
    pathname.startsWith("/api/dashboard");

  const isBuyerRoute =
    pathname === "/cart" ||
    pathname === "/orders" ||
    pathname.startsWith("/api/cart");

  if (isSellerRoute && user.role !== "seller") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isBuyerRoute && user.role !== "buyer") {
    return NextResponse.redirect(new URL("/seller/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
