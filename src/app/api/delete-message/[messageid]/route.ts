import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { AuthOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;

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

  const user: User = session.user as User;

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          status: false,
          message: "Error in modifying messages",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        status: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting message:", err);
    return Response.json(
      {
        status: false,
        message: "Error in deleting messages",
      },
      { status: 500 }
    );
  }
}
