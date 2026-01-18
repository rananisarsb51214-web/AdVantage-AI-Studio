
import React, { useState, useRef } from 'react';
import { Video, Film, Upload, Sparkles, Loader2, Download, AlertCircle, PlayCircle, Eye } from 'lucide-react';
import { generateVideo, analyzeMedia } from '../services/gemini';

const VideoLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImageBase64(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt && !imageBase64) return;
    setIsGenerating(true);
    setVideoUrl(null);
    try {
      const url = await generateVideo(prompt, aspectRatio, imageBase64 || undefined);
      if (url) setVideoUrl(url);
    } catch (err) {
      console.error(err);
      alert("Video generation failed. Ensure your API key has billing enabled.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeVideo = async () => {
    if (!imageBase64) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const mime = imageBase64.match(/data:([^;]+);/)?.[1] || 'image/png';
      const result = await analyzeMedia(imageBase64, mime, "Analyze this media and explain how it could be used for an effective viral marketing campaign.");
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-effect p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Film className="text-indigo-400" size={24} />
            Veo Engine
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Reference / Source Asset</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${imageBase64 ? 'border-indigo-500' : 'border-zinc-800 hover:border-zinc-700'}`}
              >
                {imageBase64 ? (
                  <>
                    <img src={imageBase64} className="w-full h-full object-cover" alt="Reference" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload size={24} className="text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="text-zinc-600 mb-2" size={24} />
                    <span className="text-xs text-zinc-500">Drop frame or image</span>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              <div className="flex justify-between mt-2">
                {imageBase64 && (
                  <button onClick={() => setImageBase64(null)} className="text-[10px] text-zinc-500 hover:text-white underline">Clear</button>
                )}
                {imageBase64 && (
                  <button 
                    onClick={handleAnalyzeVideo} 
                    disabled={isAnalyzing}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                  >
                    {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
                    Deep Analyze Asset
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Motion Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: 'Camera pans around the character in slow motion, neon rain falling'..."
                className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2">
                {['16:9', '9:16'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r as any)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${aspectRatio === r ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                  >
                    {r === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!prompt && !imageBase64)}
              className="w-full py-4 bg-white text-black font-black rounded-xl flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-all shadow-xl disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generate with Veo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {analysisResult && (
          <div className="glass-effect p-6 rounded-2xl border border-indigo-500/20 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2">
              <Eye size={14} /> Analysis Insights
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{analysisResult}</p>
          </div>
        )}
      </div>

      <div className="lg:col-span-8 flex flex-col h-full">
        <div className="flex-1 glass-effect rounded-3xl border border-zinc-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/20 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Video Pipeline Output</span>
            {videoUrl && (
              <a href={videoUrl} download="ad-video.mp4" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 text-xs font-bold">
                <Download size={14} /> Save Video
              </a>
            )}
          </div>
          <div className="flex-1 bg-zinc-950 flex items-center justify-center p-8 relative">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className={`max-w-full max-h-full rounded-2xl shadow-2xl border border-zinc-800 ${aspectRatio === '16:9' ? 'aspect-video' : 'h-[600px] aspect-[9/16]'}`}
              />
            ) : isGenerating ? (
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                   <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                   <Video className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Rendering Scene...</h4>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Powered by Veo 3.1 Fast</p>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-10">
                <PlayCircle size={100} className="mx-auto mb-4" />
                <p className="font-black uppercase tracking-[0.3em] text-sm">Waiting for generation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLab;
