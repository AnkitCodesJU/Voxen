"use client";

import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client"; // Uncomment when real backend is connected

interface Message {
    id: string;
    user: string;
    avatar: string; // url
    text: string;
}

export default function LiveChat({ roomId }: { roomId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Simulation of incoming messages
    useEffect(() => {
        const interval = setInterval(() => {
            const randomMsg: Message = {
                id: Date.now().toString(),
                user: "User" + Math.floor(Math.random() * 100),
                text: ["This is awesome!", "Great explanation!", "Is this recorded?", "Hello from India!"][Math.floor(Math.random() * 4)],
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.floor(Math.random() * 1000)}`
            };
            setMessages(prev => [...prev.slice(-50), randomMsg]); // keep last 50
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            user: "You",
            text: input,
            avatar: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
        };

        setMessages(prev => [...prev, newMsg]);
        setInput("");
    };

    return (
        <div className="flex flex-col h-[600px] border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden">
            <div className="p-3 border-b border-zinc-700 bg-zinc-800">
                <h3 className="font-bold text-white">Live Chat</h3>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-2 items-start">
                        <img src={msg.avatar} alt={msg.user} className="w-6 h-6 rounded-full mt-0.5" />
                        <div>
                            <span className="text-xs font-bold text-zinc-400 mr-2">{msg.user}</span>
                            <span className="text-sm text-white">{msg.text}</span>
                        </div>
                    </div>
                ))}
                {messages.length === 0 && (
                    <div className="text-center text-zinc-500 text-sm mt-20">Welcome to the chat!</div>
                )}
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t border-zinc-700 bg-zinc-800 relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Say something..."
                    className="w-full bg-black rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
            </form>
        </div>
    );
}
