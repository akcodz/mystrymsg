"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AnonymousMessage() {
  const [message, setMessage] = useState("");
  const params = useParams();
  const username = params.username; // Fixed destructuring issue

  const handleSendMessage = async () => {
    if (message.length < 10) {
      toast.error("Message must be at least 10 characters long.");
      return;
    }

    try {
      const response = await axios.post("/api/send-message", {
        content: message,
        username,
      });

      if (response.status === 200) {
        toast.success("Message sent successfully! 🎉");
        setMessage(""); // Clear input after sending
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      {/* Title */}
      <h1 className="text-5xl font-bold mb-6 text-gray-900">Public Profile Link</h1>

      {/* Message Input Section */}
      <div className="w-full max-w-md">
        <p className="text-lg mb-2 text-gray-700">
          Send Anonymous Message to{" "}
          <span className="text-blue-500 font-semibold">@{username}</span>
        </p>
        <textarea
          className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none placeholder-gray-500"
          placeholder="Write your anonymous message here"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-4">
        <Button 
          className="px-6 py-2 bg-gray-800 hover:bg-gray-950 text-white font-semibold rounded-md transition"
          onClick={handleSendMessage}
        >
          Send Message
        </Button>
      </div>
    </div>
  );
}
