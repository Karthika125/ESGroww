import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  verifySessionToken,
} from "@/lib/session";

const protectedRoutes = [
  "/upload",
  "/dashboard",
  "/results",
  "/summary",
];

export function middleware(
  request: NextRequest
) {
  const token =
    request.cookies.get(
      "session"
    )?.value;

  const pathname =
    request.nextUrl.pathname;

  const isProtected =
    protectedRoutes.some((r) =>
      pathname.startsWith(r)
    );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  const payload =
    verifySessionToken(token);

  if (!payload) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/upload/:path*",
    "/dashboard/:path*",
    "/results/:path*",
    "/summary/:path*",
  ],
};
