import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect unauthenticated users to login
  },
});

export const config = {
  matcher: ["/dashboard"], // Protect the dashboard route
};
