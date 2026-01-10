
import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, MapPin, Brain, User, Bot, Loader2, ExternalLink } from 'lucide-react';
import { chatWithThinking } from '../services/gemini';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, thinking?: boolean, grounding?: any[]}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const { text, grounding } = await chatWithThinking(userMsg, useSearch);
      setMessages(prev => [...prev, { role: 'bot', text, grounding }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error: " + (err as Error).message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex-1 overflow-y-auto space-y-6 px-2 py-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
            <Brain size={48} className="text-indigo-400" />
            <div>
              <h3 className="text-xl font-bold">AdVantage Intelligent Chat</h3>
              <p className="text-sm">Powered by Gemini 3 Pro with Thinking Mode & Search Grounding</p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-600' : 'bg-zinc-800 border border-zinc-700'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="space-y-2">
                <div className={`p-4 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'glass-effect text-zinc-200 border border-zinc-800'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
                {m.grounding && m.grounding.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.grounding.map((chunk, ci) => chunk.web && (
                      <a 
                        key={ci} 
                        href={chunk.web.uri} 
                        target="_blank" 
                        className="flex items-center gap-1 text-[10px] bg-zinc-800/50 hover:bg-zinc-800 px-2 py-1 rounded-lg text-zinc-400 transition-colors border border-zinc-800"
                      >
                        <ExternalLink size={10} />
                        <span className="truncate max-w-[150px]">{chunk.web.title || chunk.web.uri}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <Bot size={16} className="animate-pulse" />
              </div>
              <div className="glass-effect p-4 rounded-2xl border border-zinc-800 flex items-center gap-3">
                <Loader2 size={16} className="animate-spin text-indigo-400" />
                <span className="text-xs text-indigo-300 font-bold uppercase tracking-widest">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-zinc-800/50 space-y-4">
        <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
          <button 
            onClick={() => setUseSearch(!useSearch)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${useSearch ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'bg-zinc-900 border-zinc-800'}`}
          >
            <Search size={14} />
            Google Search Grounding
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg opacity-50 cursor-not-allowed">
            <MapPin size={14} />
            Maps Ready
          </div>
        </div>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Ask anything about your campaigns or market trends..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pr-14 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none min-h-[60px]"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50 transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
