import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that do not require authentication
const publicRoutes = createRouteMatcher(["/", "/signin(.*)", "/signup(.*)", "/api/github(.*)"]);

const authRoutes = createRouteMatcher(["/signin(.*)", "/signup(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const url = req.nextUrl.clone();
  
  // If user is signed in and trying to access auth routes
  if (userId && authRoutes(req)) {
    // Check if there's a redirect_url in search params (from Clerk)
    const redirectUrl = url.searchParams.get("redirect_url");
    
    if (redirectUrl) {
      // Redirect to the intended destination
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    } else {
      // Default redirect to dashboard/resumes page
      return NextResponse.redirect(new URL("/resumes", req.url));
    }
  }
  
  // Protect non-public routes
  if (!publicRoutes(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
