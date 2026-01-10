
import React from 'react';
import { CreditCard, Check, ShieldCheck, Zap, ArrowRight, Building2, User } from 'lucide-react';

const Payments: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/mo',
      description: 'Perfect for small business owners and creators.',
      features: ['50 AI Ad Generations', 'Standard Platform Export', '720p Video Resolution', 'Email Support'],
      highlight: false
    },
    {
      name: 'Pro',
      price: '$129',
      period: '/mo',
      description: 'Advanced features for scaling marketing teams.',
      features: ['Unlimited Generations', 'Multi-Platform Automation', '4K Video Export', 'Custom AI Voiceovers', 'Priority Support'],
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Full studio capabilities for large agencies.',
      features: ['Dedicated Account Manager', 'Custom AI Model Training', 'API Integration', 'SSO & Advanced Security', 'White-labeling'],
      highlight: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white">Choose Your Plan</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Scale your advertising with AI. Unlock advanced editing tools, unlimited generations, and automated multi-platform synchronization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative glass-effect p-8 rounded-3xl border transition-all hover:-translate-y-2 ${
              plan.highlight 
                ? 'border-indigo-500 shadow-2xl shadow-indigo-600/20' 
                : 'border-zinc-800'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-zinc-500">{plan.period}</span>
              </div>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-10">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center space-x-3 text-sm text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
              plan.highlight 
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30' 
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}>
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="glass-effect p-8 rounded-3xl border border-zinc-800 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <ShieldCheck className="mr-2 text-emerald-400" />
              Secure Payment Methods
            </h3>
            <p className="text-zinc-400 text-sm">
              We support Google Pay, Apple Pay, Stripe, and all major credit cards. Your data is protected with 256-bit SSL encryption.
            </p>
            <div className="flex items-center space-x-4 grayscale opacity-50">
              <div className="h-8 bg-zinc-800 px-4 rounded-lg flex items-center font-bold text-xs">VISA</div>
              <div className="h-8 bg-zinc-800 px-4 rounded-lg flex items-center font-bold text-xs">MASTERCARD</div>
              <div className="h-8 bg-zinc-800 px-4 rounded-lg flex items-center font-bold text-xs">STRIPE</div>
              <div className="h-8 bg-zinc-800 px-4 rounded-lg flex items-center font-bold text-xs">GPAY</div>
            </div>
          </div>
          <div className="w-full md:w-64 space-y-3">
             <button className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center space-x-2">
               <span>Pay with Apple Pay</span>
             </button>
             <button className="w-full py-3 bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center space-x-2">
               <span>Google Pay</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
