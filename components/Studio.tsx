
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
  Wand2,
  Crop as CropIcon,
  Check,
  X,
  Eye,
  Settings2
} from 'lucide-react';
import { generateAdContent, generateHighQualityImage, editAdImage, analyzeMedia } from '../services/gemini';
import { Platform, AdSuggestion } from '../types';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const Studio: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [prompt, setPrompt] = useState('');
  const [magicPrompt, setMagicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMagicEditing, setIsMagicEditing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [adContent, setAdContent] = useState<AdSuggestion | null>(null);
  const [adImage, setAdImage] = useState<string | null>(null);
  const [originalAdImage, setOriginalAdImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  // Image Edit States
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Crop States
  const [isCropMode, setIsCropMode] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    resetEdits();
    try {
      const [content, image] = await Promise.all([
        generateAdContent(prompt, platform),
        generateHighQualityImage(prompt, aspectRatio, imageSize)
      ]);
      setAdContent(content);
      setAdImage(image);
      setOriginalAdImage(image);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIEdit = async () => {
    if (!adImage || !magicPrompt) return;
    setIsMagicEditing(true);
    try {
      const editedImage = await editAdImage(adImage, magicPrompt);
      if (editedImage) {
        setAdImage(editedImage);
        setOriginalAdImage(editedImage);
        setMagicPrompt('');
      }
    } catch (error) {
      console.error("AI Magic Edit failed", error);
    } finally {
      setIsMagicEditing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!adImage) return;
    setIsAnalyzing(true);
    try {
      const mime = adImage.match(/data:([^;]+);/)?.[1] || 'image/png';
      const analysis = await analyzeMedia(adImage, mime, "Describe this image in detail and suggest a marketing hook.");
      alert(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAdImage(result);
        setOriginalAdImage(result);
        resetEdits();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefine = async () => {
    if (!adContent) return;
    setIsGenerating(true);
    try {
      const refined = await generateAdContent(`Refine and make this more aggressive: ${prompt}`, platform);
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
    setAdImage(originalAdImage);
    setIsCropMode(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Crop Logic
  const startDrag = (e: React.MouseEvent) => {
    if (!isCropMode) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!isDragging || !cropContainerRef.current) return;
    const rect = cropContainerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.y) / rect.height) * 100;
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100 - prev.width, prev.x + dx)),
      y: Math.max(0, Math.min(100 - prev.height, prev.y + dy))
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const stopDrag = () => setIsDragging(false);

  const applyCrop = () => {
    if (!imageRef.current || !adImage) return;
    const img = new Image();
    img.src = adImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const sourceX = (cropArea.x / 100) * img.width;
      const sourceY = (cropArea.y / 100) * img.height;
      const sourceWidth = (cropArea.width / 100) * img.width;
      const sourceHeight = (cropArea.height / 100) * img.height;
      canvas.width = sourceWidth;
      canvas.height = sourceHeight;
      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
      setAdImage(canvas.toDataURL('image/png'));
      setIsCropMode(false);
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto h-full">
      {/* Configuration Panel */}
      <div className="lg:col-span-4 space-y-6 flex flex-col h-full overflow-y-auto pr-2 pb-10">
        <div className="glass-effect p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Sparkles className="mr-2 text-indigo-400" size={18} />
            AI Creator (Pro)
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Resolution</label>
                <select 
                  value={imageSize} 
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="1K">1K Quality</option>
                  <option value="2K">2K Ultra</option>
                  <option value="4K">4K Extreme</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Ratio</label>
                <select 
                  value={aspectRatio} 
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Target Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {(['instagram', 'facebook', 'tiktok'] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      platform === p 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Campaign Brief</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your product (e.g., 'Modern minimalist smartwatch for Gen Z')..."
                className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full py-4 bg-white text-black font-black rounded-xl flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Campaign'}</span>
            </button>
          </div>
        </div>

        {adImage && (
          <div className="glass-effect p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-4">
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <Wand2 size={16} />
              AI Magic Edit
            </h3>
            <div className="relative">
              <input 
                type="text"
                value={magicPrompt}
                onChange={(e) => setMagicPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAIEdit()}
                placeholder="Ex: 'Add retro filter' or 'Remove person'..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none transition-all"
              />
              <button onClick={handleAIEdit} disabled={isMagicEditing || !magicPrompt} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">
                {isMagicEditing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            <button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
              Analyze with Gemini Pro
            </button>
          </div>
        )}

        {adImage && (
          <div className="glass-effect p-6 rounded-2xl border border-zinc-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Settings2 size={16} /> Fine-Tuning
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIsCropMode(!isCropMode)} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${isCropMode ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-200'}`}>
                  <CropIcon size={14} /> {isCropMode ? 'Exit Crop' : 'Crop'}
                </button>
                <button onClick={handleRotate} className="flex items-center justify-center gap-2 py-2.5 bg-zinc-800 text-zinc-200 rounded-xl text-xs font-bold transition-all">
                  <RotateCw size={14} /> Rotate
                </button>
              </div>

              {isCropMode && (
                <div className="flex gap-2">
                  <button onClick={applyCrop} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase">Apply</button>
                  <button onClick={() => setIsCropMode(false)} className="flex-1 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-[10px] font-black uppercase">Cancel</button>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase"><span>Brightness</span><span>{brightness}%</span></div>
                  <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full h-1 accent-indigo-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase"><span>Contrast</span><span>{contrast}%</span></div>
                  <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full h-1 accent-indigo-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase"><span>Zoom</span><span>{Math.round(zoom*100)}%</span></div>
                  <input type="range" min="100" max="300" value={zoom*100} onChange={(e) => setZoom(parseInt(e.target.value)/100)} className="w-full h-1 accent-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="lg:col-span-8 flex flex-col">
        <div className="flex-1 glass-effect rounded-3xl border border-zinc-800 flex flex-col overflow-hidden relative">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between z-10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Live Preview</span>
              <div className="flex space-x-2">
                <button className="p-2 bg-zinc-800 rounded-lg text-indigo-400"><Smartphone size={16} /></button>
                <button className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-lg"><Monitor size={16} /></button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-all">
                <Upload size={14} /> <span>Upload</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="flex-1 bg-zinc-950 p-10 flex items-center justify-center overflow-hidden">
             <div 
              ref={cropContainerRef}
              className={`relative bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-800 group transition-all duration-500`}
              style={{
                width: aspectRatio.split(':')[0] === aspectRatio.split(':')[1] ? '400px' : (parseInt(aspectRatio.split(':')[0]) > parseInt(aspectRatio.split(':')[1]) ? '500px' : '320px'),
                aspectRatio: aspectRatio.replace(':', '/')
              }}
              onMouseMove={onDrag}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
            >
              {adImage ? (
                <>
                  <div className="w-full h-full overflow-hidden flex items-center justify-center bg-black">
                    <img 
                      ref={imageRef}
                      src={adImage} 
                      alt="Ad Visual" 
                      className="w-full h-full object-cover transition-all duration-700 ease-out" 
                      style={{
                        filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                        transform: `rotate(${rotation}deg) scale(${zoom})`,
                        pointerEvents: isCropMode ? 'none' : 'auto'
                      }}
                    />
                  </div>
                  {isCropMode && (
                    <div className="absolute inset-0 bg-black/60 z-30 cursor-crosshair">
                      <div 
                        className="absolute border-2 border-indigo-400 cursor-move"
                        style={{ left: `${cropArea.x}%`, top: `${cropArea.y}%`, width: `${cropArea.width}%`, height: `${cropArea.height}%`, boxShadow: '0 0 0 1000px rgba(0,0,0,0.6)' }}
                        onMouseDown={startDrag}
                      >
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-indigo-400"></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-400"></div>
                      </div>
                    </div>
                  )}
                  {!isCropMode && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none"></div>
                      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4">
                          <h2 className="text-2xl font-black leading-tight drop-shadow-xl">{adContent?.headline || 'Your Headline'}</h2>
                          <p className="text-xs opacity-80 line-clamp-2 drop-shadow-md">{adContent?.caption || 'Marketing message...'}</p>
                          <button className="w-full py-3 bg-white text-black font-black rounded-lg text-xs mt-2 transition-transform active:scale-95 shadow-2xl">
                            {adContent?.cta || 'Shop Now'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
                  <LayoutTemplate size={48} className="opacity-20 mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">Ready to Build</p>
                </div>
              )}
              
              {(isGenerating || isMagicEditing) && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
                  <div className="text-center space-y-3">
                    <Loader2 className="animate-spin text-indigo-500 mx-auto" size={32} />
                    <p className="text-white text-xs font-black uppercase tracking-widest">Gemini Engine Running</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/40 z-10">
            <div className="flex space-x-6">
               <div className="flex items-center space-x-2 text-zinc-500"><CheckCircle2 size={14} className="text-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest">HQ Export Ready</span></div>
               <div className="flex items-center space-x-2 text-zinc-500"><CheckCircle2 size={14} className="text-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest">Safe Assets</span></div>
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all">Export</button>
              <button className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/20 transition-all">Launch Campaign</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
