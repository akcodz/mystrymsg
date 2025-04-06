import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
  dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          status: false,
          message: "User not accpeting messages",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          status: false,
          message: "User not accpeting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        status: true,
        message: "message sent successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      {
        status: false,
        message: "Error sending messages ",
      },
      { status: 400 }
    );
  }
}
