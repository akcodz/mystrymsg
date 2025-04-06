"use client"
import MessageCard from '@/components/messageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/models/User';
import { acceptingMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { data: session } = useSession();
    const form = useForm({
        resolver: zodResolver(acceptingMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptingMessage');

    const handleDeleteMessage = (messageId: string) => {
        setMessages((prev) => prev.filter((message) => message._id !== messageId));
    };

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/get-messages');
            setMessages(response.data.messages || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get('/api/get-messages');
            setValue('acceptingMessage', response.data.isAcceptingMessages);

        } catch (err) {
            console.error(err);
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessages();
    }, [fetchAcceptMessages, fetchMessages, session]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            console.log(response.data.isAcceptingMessage)
            setValue('acceptingMessage', response.data.isAcceptingMessage);
        } catch (err) {
            console.error(err);
        }
    };

    if (!session || !session.user) return null;

    const { username } = session.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="mx-auto w-[90vw]">
            <h1 className="text-4xl font-bold mt-4 mb-4">User Dashboard</h1>

            {/* Unique Profile Link */}
            <div className="mb-4 overflow-x-hidden w-full">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center justify-between w-full gap-2 ">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="p-2 border rounded bg-gray-800/20 text-gray-900 font-medium w-full sm:w-1/2 "
                    />
                    <Link href={`/u/${username}`} >
                        <Button onClick={copyToClipboard} className=''>Copy</Button>
                    </Link>
                </div>

            </div>

            <Separator className="my-4" />

            {/* Accepting Messages Toggle */}
            <div className="flex items-center gap-2">
                <Switch
                    {...register('acceptingMessage')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span>Accept Messages: {acceptMessages ? "On" : "Off"}</span>
            </div>

            <Separator className="my-4" />

            {/* Refresh Messages Button */}
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                Refresh Messages
            </Button>

            {/* Show Loading State */}
            {isLoading && <p className="mt-2 text-gray-400">Loading messages...</p>}

            {/* Messages List */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 ">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={index}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p className="text-gray-400">No messages here</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
