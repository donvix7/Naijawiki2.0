import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",
    signOut: "/logout",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists in NaijaWiki API
        const res = await fetch("http://wiki-server.giguild.com/api/auth/check-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (!res.ok) {
          console.error("User does not exist in NaijaWiki API");
          return false; // block login
        }

        const data = await res.json();

        if (!data.exists) {
          console.error("User not found");
          return false; // block login
        }

        // If user exists, retrieve the token from API
        const loginRes = await fetch("http://wiki-server.giguild.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            password: data.defaultPassword || "", // API may provide default OAuth password
          }),
        });

        if (!loginRes.ok) {
          console.error("NaijaWiki API login failed");
          return false;
        }

        const loginData = await loginRes.json();

        // Store token in secure HttpOnly cookie
        const cookieStore = cookies();
        cookieStore.set({
          name: "token",
          value: loginData.token,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24, // 1 day
        });

        // Redirect based on role
        if (loginData.role === "admin") redirect("/admin/dashboard");
        else if (loginData.role === "moderator") redirect("/moderator/dashboard");
        else redirect("/");

        return true;
      } catch (error) {
        console.error("Error signing in:", error);
        return false;
      }
    },

    async session({ session, token }) {
      // Attach token to session for client-side access
      session.user.token = token?.sub || null;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
