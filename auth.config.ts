import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl, url } }) {
      const isLoggedIn = !!auth?.user;

      const isPublic =
        nextUrl.pathname.includes("/login");

      if (!isPublic) {
        if (isLoggedIn) {
          return true;
        }
        const newUrl = new URL("/login", nextUrl.origin);
        newUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(newUrl);
      } else if (isLoggedIn) {
        return Response.redirect(nextUrl.origin);
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
