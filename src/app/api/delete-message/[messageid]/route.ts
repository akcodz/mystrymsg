import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { AuthOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function DELETE(
  req: NextRequest,
  context: { params: Record<string, string> }
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

  const user: User = session.user as User;

  try {
    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "Error in modifying messages",
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
  } catch (err) {
    console.error("Error deleting message:", err);
    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
