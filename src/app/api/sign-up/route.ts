export const config = {
  runtime: "nodejs",        // Use Node.js (not Edge runtime)
  maxDuration: 15           // Increase from 10s default
};

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"; // Optimized for serverless
import { sendVerification } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  const start = Date.now();
  console.time("📦 Total Signup");

  console.time("🔌 DB Connect");
  await dbConnect();
  console.timeEnd("🔌 DB Connect");

  try {
    const { username, email, password } = await request.json();

    console.time("🔍 Check Existing Users");
    const [existingVerifiedUser, existingUserByEmail] = await Promise.all([
      UserModel.findOne({ username, isVerified: true }),
      UserModel.findOne({ email }),
    ]);
    console.timeEnd("🔍 Check Existing Users");

    if (existingVerifiedUser) {
      console.log("⚠️ Username already exists:", username);
      return Response.json(
        { success: false, message: "Username already exists" },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpires = new Date(Date.now() + 3600000); // 1 hour from now

    console.time("🔐 Hash Password");
    const hashedPassword = bcrypt.hashSync(password, 10); // bcryptjs is sync and fast in serverless
    console.timeEnd("🔐 Hash Password");

    console.time("💾 Save User");
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        console.log("⚠️ Email already exists and verified:", email);
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpires = verifyCodeExpires;
        await existingUserByEmail.save();
        console.log("🔁 Updated existing unverified user:", email);
      }
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
      console.log("✅ New user created:", email);
    }
    console.timeEnd("💾 Save User");

    sendVerification(email, username, verifyCode)
      .then(() => console.log("📧 Verification email sent"))
      .catch((err) => console.error("❌ Email sending failed:", err));

    console.timeEnd("📦 Total Signup");
    console.log("⏱️ Signup took", Date.now() - start, "ms");

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error in signup route:", error);
    console.timeEnd("📦 Total Signup");
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
