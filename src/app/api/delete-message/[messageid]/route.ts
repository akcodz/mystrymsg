import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { AuthOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function DELETE(
  request: NextRequest,
  context: { params: { messageid: string } }
): Promise<NextResponse> {
  const messageId = context.params.messageid;

  await dbConnect();
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        status: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const user = session.user as User;

  try {
    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "Message not found or not deleted",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
