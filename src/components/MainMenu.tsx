import React from 'react';

interface MainMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (item: string) => void;
}

const MainMenu = ({ isOpen, onClose, onItemClick }: MainMenuProps) => {
  if (!isOpen) return null;

  const menuItems = [
    "TOKEN SNIPER",
    "AGENT MIRAGE", 
    "MOST ACTIVE BOOSTS",
    "DEX CHECKER",
    "RUG CHECKER"
  ];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className="fixed left-4 top-20 w-[300px] z-50 animate-in slide-in-from-top-4 duration-300">
        <div className="relative p-0.5 bg-gradient-to-b from-[#7028E2]/20 to-[#00F7FF]/20 rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7028E2]/10 via-[#00F7FF]/10 to-[#7028E2]/10 animate-pulse rounded-2xl" />
          
          <div className="relative bg-[#0a0b1e]/95 backdrop-blur-xl rounded-2xl">
            <div className="p-6 text-center relative">
              <div className="relative">
                <h2 className="text-3xl font-orbitron font-black tracking-wider bg-gradient-to-r from-[#7028E2] via-[#00F7FF] to-[#7028E2] text-transparent bg-clip-text">
                  MIRAGE
                </h2>
                <h3 className="text-lg font-space-grotesk font-bold tracking-wider text-white/80 mt-1">
                  COMMAND CENTER
                </h3>
                
                <div className="mt-4 flex justify-center items-center gap-3">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#7028E2]/50 to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-[#00F7FF]/50 animate-pulse" />
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#7028E2]/50 to-transparent" />
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 space-y-2">
              {menuItems.map((item) => (
                <MenuItem 
                  key={item}
                  text={item}
                  onClick={() => onItemClick(item)}
                />
              ))}
            </div>

            <div className="p-4 border-t border-[#7028E2]/10">
              <div className="flex items-center justify-center gap-3 text-sm font-space-grotesk">
                <span className="text-white/40">MIRAGE</span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-[#00F7FF]/80">v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface MenuItemProps {
  text: string;
  onClick: () => void;
}

const MenuItem = ({ text, onClick }: MenuItemProps) => {
  return (
    <button 
      onClick={onClick}
      className="group relative w-full p-3 rounded-xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#7028E2]/5 via-[#00F7FF]/5 to-[#7028E2]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-[#7028E2]/0 via-[#00F7FF]/10 to-[#7028E2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center justify-center">
        <span className="font-space-grotesk text-white/90 font-medium tracking-wide text-sm group-hover:text-white transition-colors duration-300">
          {text}
        </span>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-[#00F7FF]/50 to-transparent group-hover:w-full transition-all duration-500" />
    </button>
  );
};

export default MainMenu;