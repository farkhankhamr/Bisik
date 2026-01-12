import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Clock } from 'lucide-react';
import useUserStore from '../store/userStore';

export default function Chat() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const anonId = useUserStore(state => state.anonId);

    const [messages, setMessages] = useState([
        // Mock initial messages
        { id: 1, sender: 'other', content: 'Halo, boleh kenalan?', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: anonId,
            content: input,
            timestamp: new Date()
        };

        setMessages([...messages, newMessage]);
        setInput('');

        // Simulate reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'other',
                content: 'Salam kenal juga!',
                timestamp: new Date()
            }]);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 p-4 flex items-center gap-3 shadow-sm z-10">
                <button onClick={() => navigate(-1)} className="text-slate-600">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="font-bold text-slate-800">Anonim</h1>
                    <div className="flex items-center gap-1 text-xs text-brand-600 font-medium">
                        <Clock size={12} />
                        <span>24:00:00</span>
                    </div>
                </div>
            </header>

            {/* Top Safety Banner */}
            <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-center">
                <p className="text-[10px] text-amber-700 font-medium">
                    Chat ini anonim & akan berakhir otomatis.
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => {
                    const isMe = msg.sender === anonId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[75%] p-3 rounded-2xl text-sm ${isMe
                                    ? 'bg-brand-600 text-white rounded-tr-sm'
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm shadow-sm'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}

                <div className="text-center text-xs text-slate-400 my-4">
                    Chat ini akan hilang otomatis dalam 24 jam.
                </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-slate-50 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-brand-500"
                        placeholder="Tulis pesan rahasia..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="p-3 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>

                {/* Bottom Safety Hint */}
                <p className="text-[10px] text-slate-400 text-center mt-3">
                    Jangan bagikan data pribadi.
                </p>
            </div>
        </div>
    );
}
