import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !!token || !!process.env.NEXT_PUBLIC_NO_AUTH;
    },
  },
});
