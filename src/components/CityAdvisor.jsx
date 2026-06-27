import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

const CityAdvisor = () => {
    const { mongoUser } = useAuth();
    const { power, faction } = useGame();
    
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Greetings, leader! I am your Royal Advisor. How may I assist you with your city's strategy today?", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await api.post('/advisor/chat', { 
                message: userMsg,
                username: mongoUser?.username || 'Player',
                faction: faction || 'Unaligned',
                power: power || { economy: 0, military: 0, health: 0, infrastructure: 0 }
            });
            setMessages(prev => [...prev, { text: response.data.message, sender: 'ai' }]);
        } catch (error) {
            console.error("Advisor error:", error);
            setMessages(prev => [...prev, { 
                text: "My apologies, the communication channels are disrupted. (Check if the server is running and the API key is valid).", 
                sender: 'ai',
                isError: true 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <div 
                className={`mb-4 w-80 sm:w-96 bg-black/90 backdrop-blur-xl border border-ochre/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right pointer-events-auto ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-ochre/20 to-transparent border-b border-ochre/20 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="text-ochre" size={20} />
                        <h3 className="text-white font-heading tracking-widest uppercase text-sm">Royal Advisor</h3>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="h-80 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-ochre/30 scrollbar-track-transparent">
                    {messages.map((msg, idx) => (
                        <div 
                            key={idx} 
                            className={`max-w-[85%] p-3 rounded-2xl ${
                                msg.sender === 'user' 
                                ? 'bg-ochre/20 text-white self-end rounded-tr-sm border border-ochre/30' 
                                : 'bg-white/10 text-white/90 self-start rounded-tl-sm border border-white/5'
                            } ${msg.isError ? 'text-red-400 border-red-500/50' : ''}`}
                        >
                            <p className="text-sm font-body">{msg.text}</p>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="bg-white/10 text-white/90 self-start rounded-tl-sm rounded-2xl p-3 border border-white/5 flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-ochre" />
                            <span className="text-sm">Thinking...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-black/50">
                    <div className="relative flex items-center">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask for advice..."
                            disabled={isLoading}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-ochre/50 focus:ring-1 focus:ring-ochre/50 disabled:opacity-50"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !inputValue.trim()}
                            className="absolute right-2 p-1.5 text-ochre hover:bg-ochre/20 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto w-14 h-14 bg-gradient-to-tr from-ochre to-yellow-500 rounded-full shadow-lg shadow-ochre/20 flex items-center justify-center text-black hover:scale-105 transition-transform active:scale-95"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};

export default CityAdvisor;
