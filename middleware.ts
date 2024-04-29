import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    if (
      req.nextUrl.pathname === "/admin" &&
      req.nextauth.token?.role !== "admin"
    ) {
      const x=new URL("/", req.url)
      console.log();
      return NextResponse.rewrite(x.toString());
      // return new NextResponse("You are not authorized!");
    }
  },
  {
    callbacks: {
      authorized: (params) => {
        let { token } = params;
        return !!token;
      },
    },
  }
);

export const config = { matcher: ["/admin:path*"] };
