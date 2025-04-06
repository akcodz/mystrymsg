import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const AuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          console.log("Attempting sign in with:", credentials);

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            console.error("Error: User not found");
            throw new Error("User not found");
          }

          console.log("User found:", user.username);

          if (!user.isVerified) {
            console.error("Error: Account not verified");
            throw new Error("Please verify your account first");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            console.error("Error: Incorrect password");
            throw new Error("Invalid password");
          }

          console.log("Sign-in successful for:", user.username);
          return user;

        } catch (error: any) {
          console.error("Authorize Error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token._id = user._id?.toString();
          token.isVerified = user.isVerified;
          token.isAcceptingMessages = user.isAcceptingMessages;
          token.username = user.username;
        }
        return token;
      } catch (error: any) {
        console.error("JWT Callback Error:", error.message);
        throw new Error(error.message);
      }
    },
    async session({ token, session }) {
      try {
        if (token) {
          session.user._id = token._id;
          session.user.isVerified = token.isVerified;
          session.user.isAcceptingMessages = token.isAcceptingMessages;
          session.user.username = token.username;
        }
        return session;
      } catch (error: any) {
        console.error("Session Callback Error:", error.message);
        throw new Error(error.message);
      }
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};
