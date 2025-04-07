"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
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

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await axios.post(`/api/sign-up`, data);
      toast.success("Please verify the security code!");
      router.push(`/verify/${data.username}`);
    } catch (error) {
      console.log("Sign-up failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md transition duration-300 transform hover:scale-105">
        <h1 className="text-gray-900 text-4xl font-extrabold text-center mb-4">
          <Link href="/" className="cursor-pointer">
            Join <span className="text-gray-300">Mystery</span> Message
          </Link>
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Sign up to start your anonymous adventure
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-md">Username</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-50 text-gray-900 h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 w-full"
                      placeholder="Enter username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-md">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-50 text-gray-900 h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 w-full"
                      type="email"
                      placeholder="Enter email"
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
                  <FormLabel className="text-gray-700 text-md">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-50 text-gray-900 h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 w-full"
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
          Already a member?{" "}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
