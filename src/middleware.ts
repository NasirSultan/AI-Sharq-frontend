import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const publicPaths = ["/", "/authentication/signin", "/authentication/signup"]

  const isPublic = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))
  const token = request.cookies.get("token")?.value || null

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/authentication/SignIn", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|images|favicon.ico).*)"], // protect all routes except public assets
}
