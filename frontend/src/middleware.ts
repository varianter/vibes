import { NextRequest, NextResponse } from "next/server";

// nonce CSP is currently disabled because of bug:
// https://github.com/vercel/next.js/issues/55638

export function middleware(request: NextRequest) {
  const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' http://localhost https: ${
        process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
      };
      style-src 'self' 'unsafe-inline';
      font-src 'self' anima-uploads.s3.amazonaws.com fonts.gstatic.com;
      connect-src 'self' https://login.microsoftonline.com;
  `;
  const requestHeaders = new Headers(request.headers);

  // requestHeaders.set('x-nonce', nonce)
  requestHeaders.set(
    // 'Content-Security-Policy',
    "Content-Security-Policy-Report-Only", // This is used for now to not break

    // Replace newline characters and spaces
    cspHeader.replace(/\s{2,}/g, " ").trim(),
  );

  return NextResponse.next({
    headers: requestHeaders,
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
