import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface TypingNotificationProps {
  onComplete: () => void;
}

const TypingNotification: React.FC<TypingNotificationProps> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const fullText = "Welcome to the Stellanova Command Center. This advanced interface allows you to manage multiple tools simultaneously through draggable windows. Navigate through Cosmic Command Hub, Spacewalk Toolkit, and Celestial Navigator to access comprehensive market analysis and trading capabilities. Position windows anywhere on your screen for optimal workflow customization.";
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(onComplete, 2000); // Disappear after 2 seconds of completing
      }
    }, 30); // Adjust typing speed here

    return () => clearInterval(typingInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-start pt-32 justify-center z-[9998]">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      <div className="relative max-w-2xl bg-[#12131f]/90 rounded-lg border border-purple-500/20 p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <Terminal className="text-purple-400 mt-1" size={24} />
          <div>
            <div className="text-white/90 font-mono leading-relaxed">
              {text}
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingNotification;