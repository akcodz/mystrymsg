import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";
import { sendVerification } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    
    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "username already exists " },
        { status: 400 }
      );
    }
    
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "user already exist with this email" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password= hashedPassword
        existingUserByEmail.verifyCode= verifyCode
        existingUserByEmail.verifyCodeExpires= new Date(Date.now()+3600000)
        await existingUserByEmail.save()
      }
    } else {
      console.log(username,email,password)
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
      
    }
    const emailResponse = await sendVerification(email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "user registered successfully, please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error registering user : ", error);
    return Response.json(
      { success: false, message: "error registering user " },
      { status: 500 }
    );
  }
}
