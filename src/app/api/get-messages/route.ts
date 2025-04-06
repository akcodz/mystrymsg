import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        status: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(session.user._id);

  try {
    const foundUser = await UserModel.findOne(
      { _id: userId },
      { messages: 1, isAcceptingMessage: 1 } 
    );

    if (!foundUser) {
      return Response.json(
        {
          status: false,
          message: "User not found or has no messages",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        status: true,
        message: "Messages fetched successfully",
        messages: foundUser.messages.reverse(), // ✅ Sorting in JavaScript (optional)
        isAcceptingMessages: foundUser.isAcceptingMessage, // ✅ Corrected
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching messages:", err);
    return Response.json(
      {
        status: false,
        message: "Error in getting messages",
      },
      { status: 500 }
    );
  }
}
