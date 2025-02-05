import React from 'react';
import { X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      {/* Backdrop with strong blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-xl" 
        onClick={onClose} 
      />

      <div className="relative glass-effect w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10">
        {/* Header with Logo */}
        <div className="relative h-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-blue-500/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Logo Container with Animation */}
            <div className="relative">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse" />
              
              {/* Logo Image */}
              <img 
                src="https://media.discordapp.net/attachments/1313203431166709882/1334647444197343274/logo.png?ex=679d4acb&is=679bf94b&hm=9e10fe58dc5faaacedb8c9f74d985a2f46778af05c362ca400587cd31d5a33d9&=&format=webp&quality=lossless&width=750&height=750"
                alt="Stellanova Logo"
                className="w-16 h-16 rounded-full object-cover transform hover:scale-110 transition-transform duration-300 relative z-10 border-2 border-white/10 shadow-lg shadow-purple-500/20"
              />
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
              Welcome to Stellanova
            </h2>
            <p className="text-white/60 mt-1 text-sm">
              Your gateway to the future of decentralized finance
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cosmic Command Hub */}
            <div className="group p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-white/5 hover:border-white/10 transition-all">
              <div className="w-10 h-10 mb-3 rounded-full bg-gradient-to-br from-red-500 to-orange-500 p-0.5">
                <div className="w-full h-full rounded-full bg-[#12131f] flex items-center justify-center relative">
                  <div className="absolute w-2 h-2 rounded-full bg-orange-300 top-1 right-1 animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm">Cosmic Command Hub</h3>
              <p className="text-white/70 text-xs leading-relaxed">
                Effortlessly navigate through the contract address, developer wallet, and market cap, ensuring you have all the necessary resources for informed decision-making. Plus, benefit from concise, AI-driven analysis powered by DeepSeekAI, providing you with insightful descriptions about each token.
              </p>
            </div>

            {/* Spacewalk Toolkit */}
            <div className="group p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-white/5 hover:border-white/10 transition-all">
              <div className="w-10 h-10 mb-3 rounded-full bg-gradient-to-br from-blue-400 to-green-400 p-0.5">
                <div className="w-full h-full rounded-full bg-[#12131f] flex items-center justify-center relative">
                  <div className="absolute w-3 h-3 rounded-full bg-blue-300/50 -top-1 right-0 animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm">Spacewalk Toolkit</h3>
              <p className="text-white/70 text-xs leading-relaxed">
                This powerful tool not only informs you whether Dexscreener has been paid but also provides the precise date of payment. Additionally, gain exclusive access to a curated list of the latest token profiles that have successfully utilized the Dexscreener service. With the Spacewalk Toolkit, you'll be equipped to make informed decisions and stay ahead of the curve.
              </p>
            </div>

            {/* Interstellar Assistant */}
            <div className="group p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-white/5 hover:border-white/10 transition-all">
              <div className="w-10 h-10 mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-full bg-[#12131f] flex items-center justify-center relative">
                  <div className="absolute w-full h-full rounded-full border-2 border-purple-300/30 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm">Interstellar Assistant</h3>
              <p className="text-white/70 text-xs leading-relaxed">
                Your onboard AI service powered by DeepSeek. This intelligent companion is designed to answer all your questions related to the crypto universe, delivering comprehensive and insightful information at your fingertips. Whether you're seeking guidance on market trends, token analysis, or blockchain technology, the Interstellar Assistant is here to illuminate your journey through the cosmos of cryptocurrency!
              </p>
            </div>

            {/* Celestial Navigator */}
            <div className="group p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-white/5 hover:border-white/10 transition-all">
              <div className="w-10 h-10 mb-3 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 p-0.5">
                <div className="w-full h-full rounded-full bg-[#12131f] flex items-center justify-center relative">
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm">Celestial Navigator</h3>
              <p className="text-white/70 text-xs leading-relaxed">
                Your ultimate tool for tracking which coins are currently investing in boosts on Dexscreener. Not only does it provide real-time insights into which tokens are paying for promotional boosts, but it also reveals the exact amounts they're contributing. With this valuable information, you can gauge their potential visibility and performance on Dexscreener, empowering you to make informed trading decisions in the crypto cosmos!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold mt-4"
          >
            Launch Stellanova
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;