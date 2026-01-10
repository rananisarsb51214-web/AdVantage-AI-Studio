
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Radio, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { getGeminiClient } from '../services/gemini';
import { Modality } from '@google/genai';

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  let nextStartTime = 0;

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const startSession = async () => {
    setStatus('connecting');
    const ai = getGeminiClient();
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setStatus('active');
          setIsActive(true);
          const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            let binary = '';
            const bytes = new Uint8Array(int16.buffer);
            for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
            const base64 = btoa(binary);
            sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          if (msg.serverContent?.outputTranscription) {
            setTranscription(prev => [...prev.slice(-4), `Bot: ${msg.serverContent.outputTranscription.text}`]);
          }
          if (msg.serverContent?.inputTranscription) {
            setTranscription(prev => [...prev.slice(-4), `You: ${msg.serverContent.inputTranscription.text}`]);
          }
          const audioBase64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioBase64 && audioContextRef.current) {
            const buffer = await decodeAudioData(decode(audioBase64), audioContextRef.current);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            nextStartTime = Math.max(nextStartTime, audioContextRef.current.currentTime);
            source.start(nextStartTime);
            nextStartTime += buffer.duration;
            sourcesRef.current.add(source);
          }
          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
          }
        },
        onerror: (e) => {
          console.error(e);
          stopSession();
        },
        onclose: () => stopSession()
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        systemInstruction: "You are a helpful advertising expert assistant. Keep responses conversational and brief."
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
    setStatus('idle');
    setTranscription([]);
    audioContextRef.current?.close();
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-white">Gemini Live Assistant</h2>
        <p className="text-zinc-500">Real-time low-latency voice interaction for your marketing strategy.</p>
      </div>

      <div className="relative group">
        <div className={`absolute -inset-8 bg-indigo-500/20 blur-3xl rounded-full transition-all duration-1000 ${isActive ? 'opacity-100 scale-110 animate-pulse' : 'opacity-0 scale-90'}`}></div>
        <button
          onClick={isActive ? stopSession : startSession}
          disabled={status === 'connecting'}
          className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl border-4 ${isActive ? 'bg-indigo-600 border-indigo-400 scale-105' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
        >
          {status === 'connecting' ? (
            <Loader2 className="animate-spin text-white" size={48} />
          ) : isActive ? (
            <MicOff className="text-white mb-2" size={48} />
          ) : (
            <Mic className="text-indigo-400 mb-2" size={48} />
          )}
          <span className="text-xs font-black uppercase tracking-widest mt-2 text-white/80">
            {status === 'connecting' ? 'Connecting' : isActive ? 'End Call' : 'Start Session'}
          </span>
        </button>
      </div>

      <div className="w-full max-w-lg space-y-4">
        {isActive && (
          <div className="flex items-center justify-center gap-3">
             <div className="flex gap-1 items-end h-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 bg-indigo-500 rounded-full animate-bounce" style={{ height: '40%', animationDelay: `${i * 0.1}s` }}></div>
                ))}
             </div>
             <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Listening...</span>
          </div>
        )}
        
        <div className="glass-effect rounded-2xl border border-zinc-800 p-6 min-h-[160px] flex flex-col justify-end space-y-3">
          {transcription.length === 0 ? (
            <div className="text-zinc-600 text-center text-sm italic">
              Transcription will appear here in real-time...
            </div>
          ) : (
            transcription.map((t, i) => (
              <p key={i} className={`text-sm ${t.startsWith('You:') ? 'text-zinc-400' : 'text-indigo-300 font-medium'}`}>{t}</p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;
