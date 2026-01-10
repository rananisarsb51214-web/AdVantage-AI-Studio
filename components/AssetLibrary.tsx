
import React, { useState } from 'react';
import { Search, Filter, Grid, List, Download, Plus, Star } from 'lucide-react';

const AssetLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'characters' | 'elements' | 'backgrounds'>('all');

  const assets = [
    { id: 1, type: 'character', name: 'Friendly Robot 3D', url: 'https://picsum.photos/seed/char1/400/400' },
    { id: 2, type: 'background', name: 'Cyberpunk Tokyo', url: 'https://picsum.photos/seed/bg1/400/400' },
    { id: 3, type: 'element', name: 'Neon Icon Pack', url: 'https://picsum.photos/seed/elem1/400/400' },
    { id: 4, type: 'character', name: 'Mascot Bear', url: 'https://picsum.photos/seed/char2/400/400' },
    { id: 5, type: 'element', name: 'Abstract Shapes', url: 'https://picsum.photos/seed/elem2/400/400' },
    { id: 6, type: 'background', name: 'Minimal Workspace', url: 'https://picsum.photos/seed/bg2/400/400' },
    { id: 7, type: 'character', name: 'Astronaut Kid', url: 'https://picsum.photos/seed/char3/400/400' },
    { id: 8, type: 'element', name: 'Golden Sparkles', url: 'https://picsum.photos/seed/elem3/400/400' },
  ];

  const filteredAssets = activeTab === 'all' 
    ? assets 
    : assets.filter(a => a.type === activeTab.slice(0, -1));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Creative Assets</h1>
          <p className="text-zinc-400">Access thousands of premium, copyright-free 3D elements for your ads.</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20">
          <Plus size={20} />
          <span>Generate New Asset</span>
        </button>
      </div>

      <div className="flex items-center justify-between p-2 glass-effect rounded-2xl border border-zinc-800">
        <div className="flex space-x-2">
          {['all', 'characters', 'elements', 'backgrounds'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                activeTab === tab 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4 pr-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64"
            />
          </div>
          <div className="flex border border-zinc-800 rounded-xl overflow-hidden">
            <button className="p-2 bg-zinc-800 text-white"><Grid size={18} /></button>
            <button className="p-2 text-zinc-500 hover:bg-zinc-800"><List size={18} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="group relative glass-effect rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-indigo-500/30 transition-all">
            <div className="aspect-square overflow-hidden bg-zinc-900">
              <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">{asset.name}</h4>
                <span className="text-xs text-zinc-500 capitalize">{asset.type}</span>
              </div>
              <div className="flex space-x-1">
                <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Star size={16} /></button>
                <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Download size={16} /></button>
              </div>
            </div>
            <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetLibrary;
