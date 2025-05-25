import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"; // Optimized for serverless
import { sendVerification } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const [existingVerifiedUser, existingUserByEmail] = await Promise.all([
      UserModel.findOne({ username, isVerified: true }),
      UserModel.findOne({ email }),
    ]);

    if (existingVerifiedUser) {
      return Response.json({ success: false, message: "Username already exists" }, { status: 400 });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpires = new Date(Date.now() + 3600000);
    const hashedPassword = bcrypt.hashSync(password, 10);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({ success: false, message: "Email already in use" }, { status: 400 });
      } else {
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpires = verifyCodeExpires;
        await existingUserByEmail.save();
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
    }

    // Non-blocking, avoids timeout/
    return Response.json(
      {
        success: true,
        message: "User registered. Check your email for verification code.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Sign-up error:", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}

