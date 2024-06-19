import { db } from "@/db/db";
import { adminTable, advertiserTable, credentialsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Username and Password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password"}
      },
      async authorize(credentials, req) {
        const user = await db.select().from(credentialsTable).where(eq(credentialsTable.username, credentials?.username || "")).limit(1);
        if (user.length === 0 || user[0].password !== credentials?.password) {
          return null;
          }
        const isAdmin = await db.select().from(adminTable).where(eq(adminTable.credentialsId, user[0].id)).limit(1);
        if (isAdmin.length === 1) {
          return {
            id: user[0].id.toString(),
            role: "admin",
          };
        }
        const isAdvertiser = await db.select().from(advertiserTable).where(eq(advertiserTable.credentialsId, user[0].id)).limit(1);
        if (isAdvertiser.length === 1) {
          console.log("advertiser logged in");
          return {
            id: user[0].id.toString(),
            role: "advertiser"
          }
        }
        return null;
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: (token.user as any).role
        }
      }
    }
  }
})