
import React from 'react';
import { TrendingUp, Users, Target, Rocket, MoreVertical, ExternalLink } from 'lucide-react';

interface DashboardProps {
  onCreateNew: () => void;
}

const StatCard: React.FC<{ icon: any, label: string, value: string, trend: string }> = ({ icon: Icon, label, value, trend }) => (
  <div className="glass-effect p-6 rounded-2xl border border-zinc-800/50">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-zinc-800/50 rounded-xl text-indigo-400">
        <Icon size={24} />
      </div>
      <span className="text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">
        {trend}
      </span>
    </div>
    <h3 className="text-zinc-400 text-sm font-medium mb-1">{label}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onCreateNew }) => {
  const recentAds = [
    { id: 1, name: 'Summer Collection 2024', platform: 'Instagram', reach: '12.4k', ctr: '3.2%', thumbnail: 'https://picsum.photos/seed/ad1/400/400' },
    { id: 2, name: 'AI Product Launch', platform: 'Facebook', reach: '45.1k', ctr: '5.1%', thumbnail: 'https://picsum.photos/seed/ad2/400/400' },
    { id: 3, name: 'Coffee Brand Awareness', platform: 'TikTok', reach: '8.2k', ctr: '2.8%', thumbnail: 'https://picsum.photos/seed/ad3/400/400' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Jack</h1>
          <p className="text-zinc-400">Your campaigns are performing 12% better than last week.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="flex items-center space-x-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all shadow-xl"
        >
          <Rocket size={20} />
          <span>Create New Ad</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Impressions" value="1.2M" trend="+14.2%" />
        <StatCard icon={Target} label="Avg. Click Rate" value="4.8%" trend="+2.1%" />
        <StatCard icon={TrendingUp} label="Conversions" value="2.4k" trend="+8.4%" />
        <StatCard icon={TrendingUp} label="Ad Spend" value="$12,450" trend="-4.1%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Campaigns</h3>
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">View all</button>
          </div>
          
          <div className="space-y-4">
            {recentAds.map((ad) => (
              <div key={ad.id} className="glass-effect p-4 rounded-2xl flex items-center space-x-4 border border-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer group">
                <img src={ad.thumbnail} alt={ad.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{ad.name}</h4>
                  <div className="flex items-center space-x-3 text-sm text-zinc-500">
                    <span>{ad.platform}</span>
                    <span>•</span>
                    <span>Reach: {ad.reach}</span>
                  </div>
                </div>
                <div className="text-right px-6">
                  <div className="text-emerald-400 font-bold">{ad.ctr}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">CTR</div>
                </div>
                <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
          <div className="glass-effect p-6 rounded-2xl bg-indigo-600/5 border border-indigo-500/20">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <Rocket size={20} />
            </div>
            <h4 className="font-semibold text-white mb-2">Optimize "Summer Collection"</h4>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
              Gemini suggests increasing budget for TikTok as it's seeing a 2x CTR compared to Instagram in the 18-24 demographic.
            </p>
            <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
              <span>Apply Optimization</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
