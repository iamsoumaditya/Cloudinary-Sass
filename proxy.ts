import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/"
]);
interface SessionClaims {
  metadata?: {
    isAccountDeleted?: boolean;
  };
}

const isPublicApiRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/api/subscribe(.*)",
  "/faq",
  "/complaint",
  "/api/contact",
  "/terms-of-use",
  "/privacy-policy",
  "/acknowledgement",
  "/contact-us",
  "/about-us",
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth()
  const claims = sessionClaims as SessionClaims

  const currentUrl = new URL(req.url);

  const isAccessingHome = currentUrl.pathname === "/home";

  const isAccessingStatusPage = currentUrl.pathname === "/account-status";

  const isApiRequest = currentUrl.pathname.startsWith("/api");

  const isApiRequestToCancelDeletion = currentUrl.pathname.startsWith("/api/account");

  const isAccountDeleted = claims?.metadata?.isAccountDeleted ?? false;

  if (isAccountDeleted && !isAccessingStatusPage&&!isApiRequestToCancelDeletion) {
    return NextResponse.redirect(new URL("/account-status", req.url));
  }
  if (!isAccountDeleted && isAccessingStatusPage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (
    (await auth()).isAuthenticated &&
    isPublicRoute(req) &&
    !isAccessingHome
  ) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
    await auth.protect();
  }

  if (isApiRequest && !isPublicApiRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
