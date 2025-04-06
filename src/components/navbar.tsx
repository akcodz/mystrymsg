"use client"
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User | null = session?.user as User | null;

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-md">
      <Link href="/" className="text-xl font-bold">
        Mystery Message
      </Link>

      <div className="flex items-center gap-4 space-x-4">
        {session ? (
          <>
          
           
            <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })} className="rounded-md h-10  w-20 text-lg cursor-pointer">
              Sign out
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button variant="outline" className="bg-gray-900  rounded-md w-20 h-8 text-md cursor-pointer">Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
