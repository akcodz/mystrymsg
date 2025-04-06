"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, MessageCircle } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";



export default function Home() {
  const { data: session } = useSession();
  const user: User | null = session?.user as User | null;
  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  return (
    <div className="h-[93.2vh] flex flex-col items-center justify-evenly bg-gray-100 text-gray-900 px-6">
      {/* 🚀 Hero Section */}
      <section className="text-center max-w-2xl mt-4">
        <h1 className="text-7xl text-gray-900 font-bold mb-4 o">Welcome to <span className="opacity-10">Mystery</span> Message</h1>
        <p className="text-lg text-gray-700 mb-6">
          A place where you can ask anything you want anonymously.
        </p>
        {user ? 
          <Button >
          <Link className="px-6 py-3 text-lg flex items-center gap-2" href='/dashboard'>Dashboard <ArrowRight className="w-5 h-5" /></Link>
        </Button>
        : <Button >
          <Link className="px-6 py-3 text-lg flex items-center gap-2" href='/sign-up'>Get Started <ArrowRight className="w-5 h-5" /></Link>
        </Button>}
      </section>


      {/* 📌 Footer */}
      <footer className="mt-12 w-full py-4 text-center  text-gray-900 text-md">
        © {new Date().getFullYear()} Mystery Message. All rights reserved.
      </footer>
    </div>
  );
}
