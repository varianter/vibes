import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      return (
        (!!token && !req.nextUrl.basePath.startsWith("/login")) ||
        !!process.env.NEXT_PUBLIC_NO_AUTH
      );
    },
  },
});
