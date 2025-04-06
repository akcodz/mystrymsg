import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(5, { message: "message must be of alteast 5 characters" })
    .max(300, { message: "message must be less than 300 characters" }),
});
