"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { z } from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const SignIn = () => {
  
 const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsSubmitting(true);
  
      const response = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
  
      if (!response) {
        toast.error("No response from server.");
        return;
      }
  
      if (response.error) {
        console.error("Sign in error:", response.error);
        toast.error(
          response.error === "CredentialsSignin"
            ? "Invalid email or password"
            : "Error while signing in"
        );
      } else if (response.url) {
        toast.success("Signed in successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md transform transition duration-300 hover:scale-105">
        <h1 className="text-gray-900 text-4xl font-extrabold text-center mb-4">
        <Link href="/" className="cursor-pointer ">Join <span className="text-gray-300">Mystery </span>Message</Link>
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Sign in to start your anonymous adventure
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-md">
                    Email/Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-50 text-gray-900 h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400"
                      type="text"
                      placeholder="Enter email/username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-md">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-50 text-gray-900 h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400"
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 bg-gray-800 text-md text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center hover:bg-gray-950"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoaderCircle className="animate-spin mr-2" size={20} /> : "Sign Up"}
            </Button>
          </form>
        </Form>
        <p className="text-gray-600 text-center mt-6">
          New member?{" "}
          <Link href="/sign-up" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
