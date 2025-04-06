"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"; 
import { X } from "lucide-react";
import { Message } from "@/models/User";
import axios from "axios";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (args:any) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDelete = async () => {
    const response =await axios.delete(`/api/delete-message/${message._id}`)
    onMessageDelete(message._id)
  };

  return (
    <Card className="bg-gray-100 text-white w-full max-w-md p-4 shadow-lg ">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold text-gray-900">Anonymous</CardTitle> 
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="link" size="icon" className="cursor-pointer ">
              <X className="w-5 h-5 text-gray-900" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="cursor-pointer">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <p className=" block overflow-x-scroll text-gray-900 ">{message.content}</p> 
      </CardContent>
    </Card>
  );
};

export default MessageCard;
