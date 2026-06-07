import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from '@google/genai';

const AiChatbot = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [messages, setMessages] = useState([
        { role: 'model', content: "Hi! I'm your AI Financial Advisor. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch transactions and chat history when opened for context
    useEffect(() => {
        if (isOpen && user?.email) {
            // Fetch transactions
            if (transactions.length === 0) {
                axios.get(`https://cashnivo.vercel.app/transactions?email=${encodeURIComponent(user.email)}`)
                    .then(res => {
                        setTransactions(Array.isArray(res.data) ? res.data : []);
                    })
                    .catch(err => console.error("Failed to fetch transactions for AI", err));
            }

            // Fetch chat history from DB
            if (messages.length === 1) { 
                axios.get(`https://cashnivo.vercel.app/chats?email=${encodeURIComponent(user.email)}`)
                    .then(res => {
                        if (res.data && res.data.length > 0) {
                            setMessages(res.data);
                        }
                    })
                    .catch(err => console.error("Failed to fetch chat history", err));
            }
        }
    }, [isOpen, user?.email]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input.trim();
        setInput('');
        
        const newMessagesUser = [...messages, { role: 'user', content: userText }];
        setMessages(newMessagesUser);
        setIsLoading(true);

        // Sync user message to DB
        axios.post(`https://cashnivo.vercel.app/chats`, { email: user.email, messages: newMessagesUser })
            .catch(err => console.error("Failed to sync user message", err));

        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

            // Format transaction
            const txContext = transactions.map(t =>
                `${t.date.split('T')[0]}: ${t.type === 'income' ? '+' : '-'}$${t.amount} for ${t.category} (${t.description || 'no notes'})`
            ).join('\n');

            const systemInstruction = `You are a helpful, professional AI Financial Advisor built into the 'Cashnivo' expense tracker app. 
You are talking to the user.
Here is the user's recent transaction history:\n${txContext || 'No transactions yet.'}
Use this data to answer their financial questions, provide insights, and give budgeting advice. Do not mention that you were given this context directly, just use it naturally. Be concise.`;

            const contents = [
                { role: 'user', parts: [{ text: systemInstruction }] },
                { role: 'model', parts: [{ text: 'Understood. I will help the user.' }] },
                ...newMessagesUser.map(m => ({
                    role: m.role === 'model' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }))
            ];

            const response = await ai.models.generateContent({
                model: 'gemini-3.5-flash',
                contents: contents,
            });

            const botText = response.text || "I'm sorry, I couldn't generate a response.";
            const newMessagesBot = [...newMessagesUser, { role: 'model', content: botText }];
            
            setMessages(newMessagesBot);
        
            axios.post(`https://cashnivo.vercel.app/chats`, { email: user.email, messages: newMessagesBot })
                .catch(err => console.error("Failed to sync bot message", err));

        } catch (error) {
            console.error("AI Chatbot Error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please make sure you have added your VITE_GEMINI_API_KEY in your .env.local file." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] bg-base-100 dark:bg-base-200 border border-base-content/10 dark:border-base-content/20 shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-2 fade-in duration-200">
                    {/* Header */}
                    <div className="bg-linear-to-r from-blue-600 to-cyan-600 text-white p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <Bot size={20} />
                            <h3 className="font-bold">AI Financial Advisor</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-base-300 dark:bg-base-300/50 text-base-content/70'}`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`max-w-[75%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-base-200 dark:bg-base-200/50 text-base-content dark:text-base-content/90 border border-base-content/5 rounded-tl-none'}`}>
                                    {msg.role === 'user' ? (
                                        msg.content
                                    ) : (
                                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-base-300">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center shrink-0 text-base-content/70">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-base-200 rounded-2xl rounded-tl-none p-4 flex items-center gap-1 shadow-sm">
                                    <span className="loading loading-dots loading-sm"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-base-200 dark:bg-base-300/30 border-t border-base-content/10">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask about your spending..."
                                className="input input-bordered flex-1 bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="btn btn-square bg-blue-600 hover:bg-blue-700 text-white border-none transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'bg-base-300 text-base-content' : 'bg-linear-to-r from-blue-600 to-cyan-600 text-white'}`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};

export default AiChatbot;
