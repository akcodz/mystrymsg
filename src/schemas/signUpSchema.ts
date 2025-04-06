import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "username must be of atleast 3 characters")
  .max(20, "username must be of atmost 20 characters")
  .regex(
    /^[a-zA-Z0-9_]*$/,
    "username must contain only alphabets, numbers and underscores"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be of atleast 6 characters" }),
});
