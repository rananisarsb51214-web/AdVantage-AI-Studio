
import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, MapPin, Brain, User, Bot, Loader2, ExternalLink, Volume2 } from 'lucide-react';
import { chatWithThinking, textToSpeech } from '../services/gemini';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, grounding?: any[]}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [useMaps, setUseMaps] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
      const { text, grounding } = await chatWithThinking(userMsg, useSearch, useMaps);
      setMessages(prev => [...prev, { role: 'bot', text, grounding }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error: " + (err as Error).message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTTS = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const buffer = await textToSpeech(text);
      if (buffer) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await ctx.decodeAudioData(buffer);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (e) {
      console.error(e);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex-1 overflow-y-auto space-y-6 px-2 py-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
            <Brain size={48} className="text-indigo-400" />
            <div>
              <h3 className="text-xl font-bold">AdVantage Intelligence</h3>
              <p className="text-sm">Multimodal Pro Chat with Thinking & Maps Grounding</p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-600' : 'bg-zinc-800 border border-zinc-700'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="space-y-2">
                <div className={`p-4 rounded-2xl relative group ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'glass-effect text-zinc-200 border border-zinc-800'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  {m.role === 'bot' && (
                    <button 
                      onClick={() => handleTTS(m.text)}
                      className="absolute -right-2 -top-2 p-1 bg-zinc-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-400"
                    >
                      <Volume2 size={12} />
                    </button>
                  )}
                </div>
                {m.grounding && m.grounding.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.grounding.map((chunk, ci) => chunk.web && (
                      <a 
                        key={ci} 
                        href={chunk.web.uri} 
                        target="_blank" 
                        className="flex items-center gap-1 text-[10px] bg-zinc-800/50 hover:bg-zinc-800 px-2 py-1 rounded-lg text-zinc-400 border border-zinc-800"
                      >
                        <ExternalLink size={10} />
                        <span className="truncate max-w-[150px]">{chunk.web.title || chunk.web.uri}</span>
                      </a>
                    ))}
                    {m.grounding.map((chunk, ci) => chunk.maps && (
                      <a 
                        key={'m-'+ci} 
                        href={chunk.maps.uri} 
                        target="_blank" 
                        className="flex items-center gap-1 text-[10px] bg-emerald-900/20 hover:bg-emerald-800/30 px-2 py-1 rounded-lg text-emerald-400 border border-emerald-500/20"
                      >
                        <MapPin size={10} />
                        <span className="truncate max-w-[150px]">{chunk.maps.title || "View Map"}</span>
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
                <span className="text-xs text-indigo-300 font-bold uppercase tracking-widest">Logic Processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-zinc-800/50 space-y-4">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <button 
            onClick={() => { setUseSearch(!useSearch); setUseMaps(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${useSearch ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'bg-zinc-900 border-zinc-800'}`}
          >
            <Search size={12} />
            Search Grounding
          </button>
          <button 
            onClick={() => { setUseMaps(!useMaps); setUseSearch(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${useMaps ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800'}`}
          >
            <MapPin size={12} />
            Maps Grounding
          </button>
        </div>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Plan your strategy or analyze trends..."
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
