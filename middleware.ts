import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isAdminDemoPreviewAllowed, isSupabaseConfigured } from "@/lib/env";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLogin = pathname.startsWith("/admin/login");

  if (!isSupabaseConfigured()) {
    if (isAdminRoute && !isLogin && !isAdminDemoPreviewAllowed()) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(request);

  if (isAdminRoute && !isLogin && !user) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (isLogin && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api/track|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
