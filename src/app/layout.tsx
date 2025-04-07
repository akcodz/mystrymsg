import type { Metadata } from "next";
import "./globals.css"
import {  Inter } from "next/font/google";
import AuthProvidor from "@/context/AuthProvidor";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ['latin'], // ✅ Required
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head />
      <body className={`${inter.variable} antialiased`}>
        <AuthProvidor> 
          {children}
          <Toaster/>
        </AuthProvidor>
      </body>
    </html>
  );
}
