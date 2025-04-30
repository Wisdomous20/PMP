import { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server"

const authMiddleware = withAuth(
  function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === "/service-request/create") {
      return NextResponse.next()
    }

    return NextResponse.next()
  },
)

export default authMiddleware

export const config = {
  matcher: [
    "/service-request/:path*",
    "/projects/:path*",
    "/personnel-management/:path*",
    "/inventory-management/:path*",
    "/implementation-plan/:path*",
    "/dashboard/:path*",
  ],
}
