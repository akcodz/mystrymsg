import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const {searchParams} = new URL(request.url)
    const queryParam ={
        username :searchParams.get("username")
    }
    const result = usernameQuerySchema.safeParse(queryParam)
    
    if(!result.success){
        const usernameErrors = result.error.format().username?._errors ||[]
        return Response.json(
            {
              success: false,
              message: "Error in username",
            },
            {
              status: 400,
            }
          );
    }
    const {username} = result.data
    const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
    if(existingVerifiedUser){
        return Response.json(
            {
              success: false,
              message: "username under use",
            },
            {
              status: 400,
            }
          );
    }
    return Response.json(
        {
          success: true,
          message: "username is available",
        },
        {
          status: 201,
        }
      );
  } catch (error) {
    console.error("error while saving username : ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
