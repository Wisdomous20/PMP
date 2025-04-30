import { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server"

export default withAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function middleware(req: NextRequest) {
    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/auth/signin',
    },
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname === "/service-request/create") {
          return true
        }
        
        return !!token
      }
    }
  }
)

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