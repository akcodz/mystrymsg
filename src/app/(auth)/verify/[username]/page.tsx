"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";
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
import { toast } from "sonner";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    setError(""); // Reset error state
    try {
      await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast.success("Verification successful!");
      router.push("/sign-in");
    } catch (err) {
      setError("Invalid code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-gray-900 text-4xl font-bold text-center mb-6">
          Verify Your Account
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter the verification code sent to your email
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-lg">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-50 text-gray-900 h-12 border border-gray-300 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none px-4 w-full"
                      type="text"
                      placeholder="Enter verification code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
            
              className="w-full h-12 bg-gray-800 text-md  text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center hover:bg-gray-950"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;