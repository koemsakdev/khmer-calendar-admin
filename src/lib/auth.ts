import "server-only";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.username, credentials.username as string))
          .limit(1);

        if (!user.length) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user[0].passwordHash
        );

        if (!isValid) return null;

        return {
          id: user[0].id,
          name: user[0].fullName,
          email: user[0].email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});