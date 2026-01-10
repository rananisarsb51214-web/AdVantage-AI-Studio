
import React, { useState, useRef } from 'react';
import { Video, Film, Upload, Sparkles, Loader2, Download, AlertCircle, PlayCircle } from 'lucide-react';
import { generateVideo } from '../services/gemini';

const VideoLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-effect p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Film className="text-indigo-400" size={24} />
            Veo Video Generator
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Reference Image (Optional)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${imageBase64 ? 'border-indigo-500' : 'border-zinc-800 hover:border-zinc-700'}`}
              >
                {imageBase64 ? (
                  <img src={imageBase64} className="w-full h-full object-cover" alt="Reference" />
                ) : (
                  <>
                    <Upload className="text-zinc-600 mb-2" size={24} />
                    <span className="text-xs text-zinc-500">Drop an image for Veo</span>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              {imageBase64 && (
                <button onClick={() => setImageBase64(null)} className="text-[10px] text-zinc-500 mt-1 hover:text-white underline">Remove Image</button>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Video Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the cinematic action..."
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
                    {r}
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
                  <span>Synthesizing Video...</span>
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

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
          <AlertCircle className="text-amber-500 shrink-0" size={20} />
          <p className="text-xs text-amber-200 leading-relaxed">
            Video generation can take up to 2 minutes. Stay on this tab to ensure the process completes successfully.
          </p>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col">
        <div className="flex-1 glass-effect rounded-3xl border border-zinc-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Video Preview</span>
            {videoUrl && (
              <a href={videoUrl} download="ad-video.mp4" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 text-xs font-bold">
                <Download size={14} /> Download
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
                <div className="relative">
                   <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                   <Video className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Building your video...</h4>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Gemini Veo 3.1 Fast</p>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-20">
                <PlayCircle size={80} className="mx-auto mb-4" />
                <p className="font-bold uppercase tracking-[0.2em]">Queue Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLab;
