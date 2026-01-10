
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Upload, 
  LayoutTemplate, 
  RefreshCcw, 
  Smartphone, 
  Monitor, 
  CheckCircle2,
  Loader2,
  RotateCw,
  Sun,
  Contrast as ContrastIcon,
  Maximize,
  Eraser,
  Target,
  Move,
  Video,
  Image as ImageIcon,
  Download,
  AlertCircle
} from 'lucide-react';
import { generateAdContent, generateAdImage, generateAdVideo } from '../services/gemini';
import { Platform, AdSuggestion, BrandSettings } from '../types';

interface StudioProps {
  activeBrand: BrandSettings | null;
}

const Studio: React.FC<StudioProps> = ({ activeBrand }) => {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [genMode, setGenMode] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState('');
  const [adContent, setAdContent] = useState<AdSuggestion | null>(null);
  const [adImage, setAdImage] = useState<string | null>(null);
  const [adVideo, setAdVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image Edit States
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGenStatus('Initializing AI models...');
    resetEdits();
    
    try {
      if (genMode === 'image') {
        const [content, image] = await Promise.all([
          generateAdContent(prompt, platform, undefined, activeBrand || undefined),
          generateAdImage(prompt, activeBrand || undefined)
        ]);
        setAdContent(content);
        setAdImage(image);
        setAdVideo(null);
      } else {
        const videoUrl = await generateAdVideo(
          prompt, 
          platform === 'instagram' || platform === 'tiktok' ? '9:16' : '16:9',
          (status) => setGenStatus(status)
        );
        const content = await generateAdContent(prompt, platform, "High quality video commercial", activeBrand || undefined);
        setAdVideo(videoUrl);
        setAdContent(content);
        setAdImage(null);
      }
    } catch (error) {
      console.error("Generation failed", error);
      setGenStatus('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAdImage(event.target?.result as string);
        setAdVideo(null);
        resetEdits();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefine = async () => {
    if (!adContent) return;
    setIsGenerating(true);
    try {
      const refined = await generateAdContent(
        `Refine and make this more aggressive: ${prompt}`, 
        platform, 
        undefined, 
        activeBrand || undefined
      );
      setAdContent(refined);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetEdits = () => {
    setBrightness(100);
    setContrast(100);
    setRotation(0);
    setZoom(1);
    setPosX(0);
    setPosY(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!adImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - posX, y: e.clientY - posY });
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosX(e.clientX - dragStart.x);
      setPosY(e.clientY - dragStart.y);
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto h-full pb-10">
      {/* Configuration Panel */}
      <div className="lg:col-span-4 space-y-6 flex flex-col h-full overflow-y-auto pr-2">
        <div className="glass-effect p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Sparkles className="mr-2 text-indigo-400" size={18} />
              Ad Creator
            </h3>
            {activeBrand && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Target size={12} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Brand Engine On</span>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Content Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGenMode('image')}
                  className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                    genMode === 'image' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <ImageIcon size={18} />
                  <span>Static Ad</span>
                </button>
                <button
                  onClick={() => setGenMode('video')}
                  className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                    genMode === 'video' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <Video size={18} />
                  <span>Video Ad</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Target Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {(['instagram', 'facebook', 'tiktok'] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      platform === p 
                        ? 'bg-zinc-200 text-black' 
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Creative Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={genMode === 'video' ? "Describe the scene motion, lighting, and product focus..." : "Describe your product vibe..."}
                className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className={`w-full py-4 font-bold rounded-xl flex flex-col items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                genMode === 'video' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin mb-1" size={20} />
                  <span className="text-xs opacity-70 animate-pulse">{genStatus || 'Processing...'}</span>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    {genMode === 'video' ? <Video size={20} /> : <Sparkles size={20} />}
                    <span>{genMode === 'video' ? 'Generate Video Commercial' : 'Generate Static Ad'}</span>
                  </div>
                  {genMode === 'video' && <span className="text-[10px] mt-1 opacity-60">Uses Veo 3.1 • Takes ~2 mins</span>}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Image Adjustment Controls (Only for Static) */}
        {adImage && (
          <div className="glass-effect p-6 rounded-2xl border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Visual Edits</h3>
              <button onClick={resetEdits} className="text-zinc-500 hover:text-white transition-colors" title="Reset">
                <Eraser size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-zinc-400">Brightness</span><span className="text-zinc-200">{brightness}%</span></div>
                <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-zinc-400">Contrast</span><span className="text-zinc-200">{contrast}%</span></div>
                <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-zinc-400">Zoom</span><span className="text-zinc-200">{Math.round(zoom * 100)}%</span></div>
                <input type="range" min="100" max="300" value={zoom * 100} onChange={(e) => setZoom(parseInt(e.target.value) / 100)} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
              <button onClick={handleRotate} className="w-full flex items-center justify-center gap-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-medium transition-all">
                <RotateCw size={16} />
                <span>Rotate Canvas</span>
              </button>
            </div>
          </div>
        )}

        {adContent && (
          <div className="glass-effect p-6 rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Content</h3>
              <button onClick={handleRefine} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors">
                <RefreshCcw size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1 font-bold">Headline</p>
                <p className="text-zinc-200 font-medium">{adContent.headline}</p>
              </div>
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1 font-bold">Caption</p>
                <p className="text-zinc-200 text-sm leading-relaxed">{adContent.caption}</p>
              </div>
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1 font-bold">CTA</p>
                <p className="text-zinc-200 font-medium">{adContent.cta}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        <div className="glass-effect flex-1 min-h-[600px] rounded-3xl border border-zinc-800 flex flex-col overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/10 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <span className="text-zinc-400 font-bold uppercase text-xs tracking-widest">Master Preview</span>
              <div className="h-4 w-[1px] bg-zinc-800"></div>
              <div className="flex space-x-2">
                <button className="p-2 bg-zinc-800 text-indigo-400 rounded-lg"><Smartphone size={18} /></button>
                <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Monitor size={18} /></button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {adVideo && (
                <a 
                  href={adVideo} 
                  download="ad-video.mp4"
                  className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-all"
                >
                  <Download size={16} />
                  <span>Download MP4</span>
                </a>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors"
              >
                <Upload size={16} />
                <span>Upload Base</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="flex-1 bg-[#050505] p-10 flex items-center justify-center relative overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div 
              ref={containerRef}
              onMouseDown={onMouseDown}
              className={`relative ${platform === 'instagram' || platform === 'tiktok' ? 'h-full aspect-[9/16]' : 'w-full max-w-[700px] aspect-[16/9]'} bg-zinc-950 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-zinc-800/50 group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
              {(adImage || adVideo) ? (
                <>
                  <div className="w-full h-full overflow-hidden flex items-center justify-center bg-black">
                    {adVideo ? (
                      <video 
                        src={adVideo} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                      />
                    ) : (
                      <img 
                        src={adImage!} 
                        alt="Preview" 
                        className="max-w-none transition-filter duration-300 select-none pointer-events-none" 
                        style={{
                          filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                          transform: `translate(${posX}px, ${posY}px) rotate(${rotation}deg) scale(${zoom})`,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Dynamic Brand Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none p-8 flex flex-col justify-end">
                    <div className="space-y-4 transform transition-transform group-hover:translate-y-[-5px]">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs" style={{ backgroundColor: activeBrand?.colors[0] || '#6366f1', color: '#fff' }}>
                          {activeBrand?.name.charAt(0) || 'A'}
                        </div>
                        <span className="text-sm font-bold tracking-tight text-white drop-shadow-md">{activeBrand?.name || 'AdVantage Brand'}</span>
                      </div>
                      <h2 className="text-3xl font-black leading-none uppercase tracking-tighter text-white drop-shadow-xl">
                        {adContent?.headline || 'Your Message Here'}
                      </h2>
                      <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed drop-shadow-md max-w-[90%] font-medium">
                        {adContent?.caption || 'Describe your vision to see it come to life.'}
                      </p>
                      <button 
                        className="w-full py-4 font-black rounded-xl text-sm mt-2 shadow-[0_10px_30px_rgba(0,0,0,0.3)] pointer-events-auto transition-all active:scale-95"
                        style={{ backgroundColor: activeBrand?.colors[0] || '#fff', color: activeBrand?.colors[0] === '#ffffff' ? '#000' : '#fff' }}
                      >
                        {adContent?.cta || 'Learn More'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 p-12 text-center">
                  <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800">
                    {genMode === 'video' ? <Video size={40} className="opacity-20" /> : <ImageIcon size={40} className="opacity-20" />}
                  </div>
                  <h4 className="text-zinc-400 font-bold text-lg mb-2">Ready for generation</h4>
                  <p className="text-sm opacity-50 max-w-[240px]">Fill in the brief on the left to create your {genMode === 'video' ? 'video commercial' : 'static advertisement'}.</p>
                </div>
              )}
              
              {isGenerating && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 pointer-events-auto">
                  <div className="text-center space-y-6 px-10">
                    <div className="relative inline-block">
                       <Loader2 className="animate-spin text-indigo-500" size={64} />
                       <div className="absolute inset-0 flex items-center justify-center">
                         <Sparkles className="text-white animate-pulse" size={24} />
                       </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white text-xl font-black tracking-tight uppercase">AI is Building Your Ad</p>
                      <p className="text-indigo-400 text-sm font-bold animate-pulse uppercase tracking-widest">{genStatus}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                      <AlertCircle size={14} className="text-zinc-500" />
                      <p className="text-xs text-zinc-500 leading-tight">Video generation takes up to 2 minutes. Please keep this tab open.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-zinc-800 flex items-center justify-between bg-zinc-950">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">AI Optimizing for CTR</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-500">
                <CheckCircle2 size={16} className="text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-tighter">HD 4K Native Support</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-all border border-zinc-700">
                Save to Assets
              </button>
              <button className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-black shadow-xl shadow-indigo-600/30 transition-all flex items-center space-x-2 active:scale-95">
                <span>Deploy to {platform}</span>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
