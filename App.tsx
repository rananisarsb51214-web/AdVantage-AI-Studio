
import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  PlusSquare, 
  Image as ImageIcon, 
  Settings, 
  CreditCard, 
  Zap,
  Video,
  MessageSquare,
  Mic,
  Key
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import Dashboard from './components/Dashboard';
import Studio from './components/Studio';
import AssetLibrary from './components/AssetLibrary';
import Payments from './components/Payments';
import AIChat from './components/AIChat';
import VideoLab from './components/VideoLab';
import LiveAssistant from './components/LiveAssistant';

type View = 'dashboard' | 'studio' | 'assets' | 'payments' | 'settings' | 'video' | 'chat' | 'live';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        setHasApiKey(true); // Fallback if outside AI Studio environment
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const NavItem: React.FC<{ 
    view: View; 
    icon: React.ElementType; 
    label: string 
  }> = ({ view, icon: Icon, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
      }`}
    >
      <Icon size={20} />
      {isSidebarOpen && <span className="font-medium">{label}</span>}
    </button>
  );

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } glass-effect border-r border-zinc-800 transition-all duration-300 hidden md:flex flex-col z-50`}
        >
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center neon-glow">
            <Zap className="text-white" size={24} fill="white" />
          </div>
          {isSidebarOpen && <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">AdVantage</span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem view="dashboard" icon={Layout} label="Dashboard" />
          <NavItem view="studio" icon={PlusSquare} label="Ad Studio" />
          <NavItem view="video" icon={Video} label="Video Lab" />
          <NavItem view="chat" icon={MessageSquare} label="AI Chat" />
          <NavItem view="live" icon={Mic} label="Assistant" />
          <NavItem view="assets" icon={ImageIcon} label="Asset Library" />
          <NavItem view="payments" icon={CreditCard} label="Billing" />
        </nav>

        {!hasApiKey && (
          <div className="p-4">
            <button 
              onClick={handleSelectKey}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-amber-600/20 text-amber-400 border border-amber-500/20 rounded-xl text-sm font-bold hover:bg-amber-600/30 transition-all"
            >
              <Key size={16} />
              {isSidebarOpen && <span>Connect Key</span>}
            </button>
          </div>
        )}

        <div className="p-4 border-t border-zinc-800">
          <NavItem view="settings" icon={Settings} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0b] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50 z-40 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 md:block hidden"
            >
              <Layout size={20} />
            </button>
            <h2 className="text-lg font-semibold text-zinc-200 capitalize">
              {currentView.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20">
              Upgrade
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <span className="text-xs font-bold text-zinc-400">JD</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 relative">
          {currentView === 'dashboard' && <Dashboard onCreateNew={() => setCurrentView('studio')} />}
          {currentView === 'studio' && <Studio />}
          {currentView === 'video' && <VideoLab />}
          {currentView === 'chat' && <AIChat />}
          {currentView === 'live' && <LiveAssistant />}
          {currentView === 'assets' && <AssetLibrary />}
          {currentView === 'payments' && <Payments />}
          {currentView === 'settings' && (
            <div className="max-w-4xl mx-auto py-10 text-center">
              <h1 className="text-3xl font-bold mb-4">Settings</h1>
              <p className="text-zinc-400">Account management and API configuration.</p>
              {!hasApiKey && (
                 <div className="mt-8">
                   <p className="text-sm text-zinc-500 mb-4">You need to select an API key from a paid GCP project to use Veo and Gemini 3 Pro features.</p>
                   <button onClick={handleSelectKey} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200">Select API Key</button>
                   <p className="mt-2 text-xs text-zinc-600">See <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">billing documentation</a>.</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
    <Analytics />
  </>
  );
};

export default App;
