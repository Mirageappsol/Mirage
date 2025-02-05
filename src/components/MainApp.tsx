import React, { useState, useEffect } from 'react';
import { Menu, X, ExternalLink, Copy, ListPlus, Eye, EyeOff, Github } from 'lucide-react';
import MainMenu from './MainMenu';
import StellanovaChat from './AstrosChat';
import MissionControl from './MissionControl';
import EvaToolkit from './EvaToolkit';
import StarCharts from './StarCharts';
import XLogo from './XLogo';
import TokenSidebar from './TokenSidebar';
import CryptoTickerBar from './CryptoTickerBar';
import RugChecker from './RugChecker';

const MainApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTokenSidebarOpen, setIsTokenSidebarOpen] = useState(false);
  const [menuButtonPulsing, setMenuButtonPulsing] = useState(true);
  const [stars, setStars] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  const [visibleWindows, setVisibleWindows] = useState({
    missionControl: true,
    evaToolkit: true,
    starCharts: false,
    rugChecker: false
  });

  const contractAddress = (window as any).CONTRACT_ADDRESS;
  const socialLinks = (window as any).SOCIAL_LINKS || {
    twitter: "https://twitter.com/PumpFunToken",
    website: "https://pump.fun"
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 3}px`,
          height: `${Math.random() * 3}px`,
          animationDelay: `${Math.random() * 4}s`,
          opacity: Math.random() * 0.7 + 0.3
        }
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  const handleMenuItemClick = (item: string) => {
    switch (item) {
      case 'TOKEN SNIPER':
        setVisibleWindows(prev => ({ ...prev, missionControl: true }));
        break;
      case 'DEX CHECKER':
        setVisibleWindows(prev => ({ ...prev, evaToolkit: true }));
        break;
      case 'MOST ACTIVE BOOSTS':
        setVisibleWindows(prev => ({ ...prev, starCharts: true }));
        break;
      case 'AGENT MIRAGE':
        setIsChatOpen(true);
        break;
      case 'RUG CHECKER':
        setVisibleWindows(prev => ({ ...prev, rugChecker: true }));
        break;
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e] p-4">
      {/* Animated Space Background */}
      <div className="space-background" />
      <div className="nebula-background" />
      
      {/* Stars */}
      {stars.map(star => (
        <div key={star.id} className="star" style={star.style} />
      ))}

      <div className="relative z-10">
        {/* Top Navigation */}
        <nav className="flex justify-between items-center h-20 relative z-50 bg-gradient-to-r from-[#0f172a]/90 via-[#1e293b]/90 to-[#0f172a]/90 rounded-xl mb-4 shadow-xl border border-[#3b82f6]/20">
          {/* Left Section - Menu Button */}
          <div className="flex items-center pl-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6]/20 to-[#60a5fa]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setMenuButtonPulsing(false);
                }}
                className="relative flex items-center justify-center w-10 h-10 bg-[#1e293b]/60 rounded-lg border border-[#3b82f6]/20 hover:border-[#3b82f6]/40 transition-all duration-300"
              >
                <Menu className="text-white w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Section - Logo */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <img 
                src="https://media.discordapp.net/attachments/1313203431166709882/1335662107898937365/universal_upscale_0_00b3e10b-6de4-4380-ace3-9b17132e8e7e_0.png?ex=67a44785&is=67a2f605&hm=62f68eedd1a9d6a90b6754e9cc49e073c48cc7c0754f921bffeab6414fdbaa98&=&format=webp&quality=lossless&width=1000&height=1000"
                alt="Mirage Logo"
                className="h-12 w-12 object-contain rounded-lg"
              />
              <div className="text-white">
                <h1 className="text-2xl font-orbitron font-bold tracking-wider bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  MIRAGE
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-white/80 font-space-grotesk">Trading Hub</p>
                  <span className="text-white/70 px-2 py-0.5 rounded bg-[#3b82f6]/5 border border-[#3b82f6]/10 font-space-grotesk">
                    Powered by <span className="text-[#3b82f6]">gpt-03mini</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Contract & Social Links */}
          <div className="flex items-center gap-3 pr-4">
            {/* Contract Address */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6]/20 to-[#60a5fa]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <button className="relative flex items-center gap-2 px-4 py-2 bg-[#1e293b]/60 rounded-lg border border-[#3b82f6]/20 hover:border-[#3b82f6]/40 transition-all duration-300">
                <span className="text-[#93c5fd] text-sm font-space-grotesk">Contract:</span>
                <span className="text-white font-mono">
                  {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                </span>
                <Copy 
                  size={16} 
                  onClick={() => copyToClipboard(contractAddress)}
                  className="text-[#93c5fd] hover:text-white transition-colors cursor-pointer"
                />
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6]/20 to-[#60a5fa]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center justify-center w-10 h-10 bg-[#1e293b]/60 rounded-lg border border-[#3b82f6]/20 hover:border-[#3b82f6]/40 transition-all duration-300"
                >
                  <XLogo className="text-white w-5 h-5" />
                </a>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6]/20 to-[#60a5fa]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center gap-2 px-4 py-2 bg-[#1e293b]/60 rounded-lg border border-[#3b82f6]/20 hover:border-[#3b82f6]/40 transition-all duration-300"
                >
                  <img 
                    src="https://media.discordapp.net/attachments/1313203431166709882/1335663319931162704/Pump_fun_logo.png?ex=67a448a6&is=67a2f726&hm=b239041f06d09aad22c671f9737b23d4c63ae3d81321f0478e5d96c1a5c83886&=&format=webp&quality=lossless&width=583&height=583"
                    alt="PUMP.FUN"
                    className="w-6 h-6 object-contain"
                  />
                  <ExternalLink className="text-white w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Components */}
        <MainMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onItemClick={handleMenuItemClick} />
        {visibleWindows.missionControl && <MissionControl onClose={() => setVisibleWindows(prev => ({ ...prev, missionControl: false }))} />}
        {visibleWindows.evaToolkit && <EvaToolkit onClose={() => setVisibleWindows(prev => ({ ...prev, evaToolkit: false }))} />}
        {visibleWindows.starCharts && <StarCharts onClose={() => setVisibleWindows(prev => ({ ...prev, starCharts: false }))} />}
        {visibleWindows.rugChecker && <RugChecker onClose={() => setVisibleWindows(prev => ({ ...prev, rugChecker: false }))} />}
        <StellanovaChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        
        <TokenSidebar isOpen={isTokenSidebarOpen} onClose={() => setIsTokenSidebarOpen(false)} />

        {/* Toggle Button - Moves left when sidebar is open */}
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6]/20 to-[#60a5fa]/20 rounded-r-xl blur opacity-0 group-hover:opacity-100 transition duration-300 ${
            isTokenSidebarOpen ? 'left-[300px]' : 'left-0'
          }`}></div>
          <button
            onClick={() => setIsTokenSidebarOpen(!isTokenSidebarOpen)}
            className={`fixed top-1/2 -translate-y-1/2 z-[46] h-48 w-12 bg-gradient-to-b from-[#1e293b] to-[#0f172a] flex items-center justify-center group overflow-hidden transition-all duration-300 hover:w-14 ${
              isTokenSidebarOpen 
                ? 'left-[300px] rounded-r-xl' 
                : 'left-0 rounded-r-xl'
            } border border-[#3b82f6]/20 hover:border-[#3b82f6]/40`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#3b82f6]/10 to-[#60a5fa]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <ListPlus className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110" size={24} />
          </button>
        </div>
      </div>

      {/* Crypto Ticker Bar */}
      <CryptoTickerBar />
    </div>
  );
};

export default MainApp;