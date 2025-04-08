import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";
import { sendVerification } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  const startTime = Date.now();
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const [existingVerifiedUser, existingUserByEmail] = await Promise.all([
      UserModel.findOne({ username, isVerified: true }),
      UserModel.findOne({ email }),
    ]);

    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username already exists" },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCodeExpires = new Date(Date.now() + 3600000); // 1 hour

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
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

    // Send email in background
    sendVerification(email, username, verifyCode)
      .then(() => console.log("✅ Verification email sent"))
      .catch((err) => console.error("❌ Email error:", err));

    console.log("⏱️ Signup took", Date.now() - startTime, "ms");

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error registering user:", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
