export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    // "/",
    "/service-request/:path*",
    "/projects/:path",
    "/personnel-management/:path",
    "/inventory-management/:path",
    "/implementation-plan/:path",
    "/dashboard/:path"
  ],
}
