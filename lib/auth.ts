import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("No user found with the given email");
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: any; user?: { id: string } }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
