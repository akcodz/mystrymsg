import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(AuthOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        status: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          status: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        status: true,
        message: "acceptMessages updated successfully",
        isAcceptingMessage: updatedUser?.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      {
        status: false,
        message: "Error updating acceptMessages",
      },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(AuthOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        status: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          status: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
console.log(user)
    return Response.json(
      {
        status: true,
        message: "acceptMessages status fetched successfully",
        isAcceptingMessages:foundUser.isAcceptingMessage
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      {
        status: false,
        message: "Error in gettting acceptMessages status",
      },
      { status: 400 }
    );
  }
}
