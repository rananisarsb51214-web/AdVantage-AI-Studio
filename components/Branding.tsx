
import React, { useState } from 'react';
import { 
  Shield, 
  Palette, 
  Type as TypeIcon, 
  Mic, 
  Sparkles, 
  Loader2, 
  Save, 
  CheckCircle,
  Copy,
  Info,
  Layout,
  Mail,
  Instagram,
  Globe,
  RefreshCcw,
  Image as ImageIcon
} from 'lucide-react';
import { generateBrandingGuidelines } from '../services/gemini';
import { BrandSettings } from '../types';

interface BrandingProps {
  onBrandCreated: (settings: BrandSettings) => void;
  initialSettings: BrandSettings | null;
}

const Branding: React.FC<BrandingProps> = ({ onBrandCreated, initialSettings }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [settings, setSettings] = useState<BrandSettings | null>(initialSettings);
  const [activeTab, setActiveTab] = useState<'identity' | 'visuals' | 'voice' | 'mockups'>('identity');

  const handleGenerate = async () => {
    if (!brandName || !businessType) return;
    setIsGenerating(true);
    try {
      const result = await generateBrandingGuidelines(brandName, businessType);
      setSettings(result);
      onBrandCreated(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const SectionCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ElementType }> = ({ title, children, icon: Icon }) => (
    <div className="glass-effect p-6 rounded-2xl border border-zinc-800/50 space-y-4 h-full">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Branding Guidelines</h1>
          <p className="text-zinc-400">Define your brand's DNA and maintain consistency across all channels.</p>
        </div>
        {!settings ? (
          <div className="flex items-center space-x-3 glass-effect p-2 rounded-2xl border border-zinc-800">
            <input 
              type="text" 
              placeholder="Brand Name" 
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Business Type" 
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !brandName || !businessType}
              className="flex items-center space-x-2 px-6 py-2 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              <span>Generate DNA</span>
            </button>
          </div>
        ) : (
          <div className="flex space-x-3">
            <button 
              onClick={() => { setSettings(null); onBrandCreated(null as any); }}
              className="flex items-center space-x-2 px-4 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition-all"
            >
              <RefreshCcw size={18} />
              <span>Reset</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
              <Save size={18} />
              <span>Save Guidelines</span>
            </button>
          </div>
        )}
      </div>

      {!settings ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-20 glass-effect rounded-[40px] border-dashed border-2 border-zinc-800 text-center space-y-6">
            <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-500">
              <Shield size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Your Brand DNA Awaits</h2>
              <p className="text-zinc-500 max-w-sm">Enter your brand name above to generate custom guidelines, color palettes, and voice instructions powered by Gemini.</p>
            </div>
          </div>
          <div className="glass-effect p-8 rounded-[40px] border border-zinc-800 flex flex-col justify-center space-y-6">
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit">
              <Info size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Why Guidelines Matter?</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-zinc-400 text-sm">
                <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Consistency builds trust and improves recognition by up to 80%.</span>
              </li>
              <li className="flex items-start space-x-3 text-zinc-400 text-sm">
                <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Defined voice ensures AI-generated copy sounds human and unique.</span>
              </li>
              <li className="flex items-start space-x-3 text-zinc-400 text-sm">
                <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Unified visuals streamline design workflows across teams.</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'identity', label: 'Brand Identity', icon: Shield },
              { id: 'visuals', label: 'Visual Language', icon: Palette },
              { id: 'voice', label: 'Voice & Tone', icon: Mic },
              { id: 'mockups', label: 'Brand Mockups', icon: Layout },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl border transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {activeTab === 'identity' && (
              <div className="grid grid-cols-1 gap-6">
                <SectionCard title="Mission Statement" icon={Shield}>
                  <p className="text-zinc-300 leading-relaxed italic text-lg">"{settings.mission}"</p>
                </SectionCard>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SectionCard title="Core Values" icon={CheckCircle}>
                    <div className="flex flex-wrap gap-2">
                      {settings.values.map((v, i) => (
                        <span key={i} className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-sm font-medium border border-indigo-500/20">
                          {v}
                        </span>
                      ))}
                    </div>
                  </SectionCard>
                  <SectionCard title="Unique Selling Proposition" icon={Sparkles}>
                    <p className="text-zinc-400 text-sm leading-relaxed">{settings.usp}</p>
                  </SectionCard>
                </div>
              </div>
            )}

            {activeTab === 'visuals' && (
              <div className="space-y-6">
                <SectionCard title="Primary Color Palette" icon={Palette}>
                  <div className="grid grid-cols-5 gap-4">
                    {settings.colors.map((color, i) => (
                      <div key={i} className="space-y-2">
                        <div 
                          className="h-24 rounded-2xl border border-white/10 shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 group relative"
                          style={{ backgroundColor: color }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy size={20} className="text-white drop-shadow-md" />
                          </div>
                        </div>
                        <p className="text-center font-mono text-xs text-zinc-500 font-bold uppercase">{color}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SectionCard title="Typography" icon={TypeIcon}>
                    <div className="space-y-6">
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-2 font-bold uppercase tracking-widest">Primary (Headlines)</p>
                        <p className="text-2xl text-white font-bold" style={{ fontFamily: 'Inter' }}>{settings.fonts.primary}</p>
                        <p className="text-zinc-400 text-xs mt-2 italic">The quick brown fox jumps over the lazy dog.</p>
                      </div>
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-2 font-bold uppercase tracking-widest">Secondary (Body)</p>
                        <p className="text-xl text-zinc-300" style={{ fontFamily: 'Inter' }}>{settings.fonts.secondary}</p>
                        <p className="text-zinc-500 text-xs mt-2 italic">Building a better future together.</p>
                      </div>
                    </div>
                  </SectionCard>
                  <SectionCard title="Logo Usage" icon={ImageIcon}>
                    <div className="h-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600 hover:border-indigo-500/50 hover:text-indigo-400 transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-500/10">
                        <Sparkles size={24} />
                      </div>
                      <span className="text-sm font-medium">Upload Brand Logo</span>
                      <span className="text-xs mt-1">PNG, SVG or AI format</span>
                    </div>
                  </SectionCard>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="grid grid-cols-1 gap-6">
                <SectionCard title="Brand Voice & Tone" icon={Mic}>
                  <p className="text-zinc-300 leading-relaxed text-lg">{settings.voice}</p>
                </SectionCard>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Writing Style', value: 'Concise & Direct' },
                    { label: 'Emoji Usage', value: 'Moderate & Intentional' },
                    { label: 'Audience Dialect', value: 'Professional Modern' }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-white font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'mockups' && (
              <div className="space-y-8 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Website Header Mockup */}
                  <SectionCard title="E-commerce Header" icon={Globe}>
                    <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden text-black border border-zinc-200">
                      <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-100" style={{ backgroundColor: settings.colors[4] + '20' }}>
                        <div className="font-bold text-xl" style={{ color: settings.colors[0], fontFamily: 'Inter' }}>{settings.name}</div>
                        <nav className="hidden md:flex space-x-4 text-xs font-semibold text-zinc-600">
                          <span>SHOP</span>
                          <span>STORY</span>
                          <span>CONTACT</span>
                        </nav>
                        <div className="flex space-x-3">
                          <div className="w-6 h-6 rounded-full bg-zinc-100"></div>
                          <div className="w-6 h-6 rounded-full bg-zinc-100 relative">
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">2</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-10 text-center space-y-4" style={{ backgroundColor: settings.colors[0] }}>
                        <h4 className="text-3xl font-black text-white leading-tight">{settings.name}: Redefined.</h4>
                        <button className="px-6 py-2 bg-white text-black font-bold rounded-lg text-sm transition-transform active:scale-95 shadow-lg">
                          EXPLORE NOW
                        </button>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Social Media Story Mockup */}
                  <SectionCard title="Social Media Story" icon={Instagram}>
                    <div className="w-full aspect-[9/16] max-w-[280px] mx-auto rounded-3xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-zinc-950">
                      <div className="absolute top-0 inset-x-0 h-1 bg-white/20 m-4 rounded-full overflow-hidden flex">
                         <div className="h-full bg-white w-1/3"></div>
                      </div>
                      <div className="h-full flex flex-col justify-center items-center p-8 space-y-6" style={{ background: `linear-gradient(180deg, ${settings.colors[0]} 0%, ${settings.colors[1]} 100%)` }}>
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20">
                          <Sparkles size={32} className="text-white" />
                        </div>
                        <div className="text-center space-y-2">
                          <h4 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">Your New Favorite</h4>
                          <p className="text-white/80 text-xs font-medium">{settings.usp}</p>
                        </div>
                        <div className="w-full h-[1px] bg-white/20"></div>
                        <button className="px-8 py-3 bg-white text-black font-bold rounded-full text-xs transition-transform active:scale-95 shadow-xl">
                          TAP TO SHOP
                        </button>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Email Marketing Mockup */}
                  <SectionCard title="Email Newsletter" icon={Mail}>
                    <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden text-black border border-zinc-200">
                      <div className="p-8 text-center space-y-6">
                        <div className="text-2xl font-black tracking-tighter" style={{ color: settings.colors[0] }}>{settings.name.toUpperCase()}</div>
                        <div className="w-full aspect-video bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-300 italic border border-zinc-200">
                           Featured Lifestyle Image
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-xl font-bold tracking-tight">Something Special for You.</h4>
                           <p className="text-sm text-zinc-500 leading-relaxed">We're on a mission: {settings.mission}</p>
                        </div>
                        <button className="px-10 py-3 text-white font-bold rounded-xl text-sm transition-transform active:scale-95" style={{ backgroundColor: settings.colors[0] }}>
                          Claim Your Offer
                        </button>
                        <div className="pt-4 flex justify-center space-x-4 opacity-30">
                           <div className="w-4 h-4 bg-black rounded-sm"></div>
                           <div className="w-4 h-4 bg-black rounded-sm"></div>
                           <div className="w-4 h-4 bg-black rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  </SectionCard>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Branding;
