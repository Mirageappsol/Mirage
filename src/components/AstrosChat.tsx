import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useCryptoPrices } from '../context/CryptoPriceContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface StellanavaChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const StellanovaChat: React.FC<StellanavaChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm Agent Mirage, your Mirage Assistant. I can help you with:\n\n" +
        "• Using the Token Sniper for token analysis\n" +
        "• Navigating the Dex Checker for order verification\n" +
        "• Understanding the Most Active Boosts data\n" +
        "• Using the Rug Checker for security analysis\n" +
        "• Managing draggable windows and interface features\n\n" +
        "How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { prices } = useCryptoPrices();

  const getPriceInfo = (symbol: string) => {
    const crypto = prices.find(p => 
      p.id.toLowerCase() === symbol.toLowerCase() || 
      p.symbol.toLowerCase() === symbol.toLowerCase()
    );
    
    if (crypto) {
      const price = parseFloat(crypto.priceUsd).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      const change = parseFloat(crypto.changePercent24Hr);
      const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
      return { price, change: changeText };
    }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check for price queries
      const priceMatch = input.toLowerCase().match(/(?:what(?:'s| is) (?:the )?price (?:of )?|how much is )(\w+)(?:\s|$)/);
      if (priceMatch) {
        const symbol = priceMatch[1];
        const priceInfo = getPriceInfo(symbol);
        
        if (priceInfo) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `The current price of ${symbol.toUpperCase()} is ${priceInfo.price} (24h change: ${priceInfo.change})`
          }]);
          setIsLoading(false);
          return;
        }
      }

      // For non-price queries, use the chatbot API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are Agent Mirage, an expert on the Mirage Trading Terminal website and all its features. Your role is to help users understand and navigate the platform effectively. The main tools are Token Sniper, Dex Checker, Most Active Boosts, and Rug Checker.`
            },
            ...messages,
            userMessage
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || 'I apologize, but I am temporarily unable to process your request. Please try again.'
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I am temporarily unable to process your request. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-4 bottom-20 w-[500px] h-[600px] glass-effect rounded-xl shadow-xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://media.discordapp.net/attachments/1313203431166709882/1335662107898937365/universal_upscale_0_00b3e10b-6de4-4380-ace3-9b17132e8e7e_0.png?ex=67a39ec5&is=67a24d45&hm=7a527235ba59b8e036e1928e23fc00c8549c8440079b82921779f20d4a765430&=&format=webp&quality=lossless&width=1000&height=1000"
                alt="Mirage Logo"
                className="w-8 h-8 object-contain rounded-lg"
              />
              <div>
                <h3 className="text-white font-bold">AGENT MIRAGE</h3>
                <div className="flex items-center gap-2">
                  <p className="text-purple-400 text-xs">Mirage Assistant</p>
                  <span className="text-white/20">•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-white/40">Powered by</span>
                    <span className="text-blue-400 text-xs">deepseek</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#12131f] text-white/90 border border-purple-500/20'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#12131f] text-white/90 rounded-lg p-4 border border-purple-500/20 flex items-center gap-2">
                <Sparkles className="text-purple-400 animate-pulse" size={16} />
                Processing your request...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-purple-500/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="How can I help you with Mirage?"
              className="flex-1 bg-[#12131f] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-500/20"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StellanovaChat;