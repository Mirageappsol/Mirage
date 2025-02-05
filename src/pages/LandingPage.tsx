import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, ExternalLink, Copy, Github } from 'lucide-react';
import PlexusAnimation from '../components/PlexusAnimation';
import XLogo from '../components/XLogo';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const contractAddress = (window as any).CONTRACT_ADDRESS;
  const socialLinks = (window as any).SOCIAL_LINKS || {
    twitter: "https://twitter.com/PumpFunToken",
    website: "https://pump.fun"
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-section');
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.8;
        if (isVisible) {
          element.classList.add('fade-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/app');
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const features = [
    {
      title: "Tailored for Solana",
      subtitle: "Seamless integration with the world's leading AI models",
      cards: [
        {
          title: "Cutting-Edge AI Intelligence",
          description: "Harness the power of the world's most advanced AI models, including DeepSeek and GPT-3o, to intelligently analyze your Solana transactions in real-time, providing data-driven insights and seamless automated actions."
        },
        {
          title: "Seamless Execution",
          description: "Experience ultra-efficient, frictionless transactions powered by our deep Solana integration. Enjoy smooth, rapid execution without the need for compromise."
        }
      ]
    },
    {
      title: "Comprehensive Ecosystem Integration",
      description: "Effortlessly connect with the full spectrum of Solana's protocols and services. Our platform is designed for seamless AI-powered collaboration, ensuring full synergy with the ecosystem.",
      integrationImage: {
        url: "https://media.discordapp.net/attachments/1313203431166709882/1335660071455166555/diagram.png?ex=67a445a0&is=67a2f420&hm=a75671b165c35aad99e381b5a939ee78a50329eb61d3248c9795fd8d2c3b1c57&=&format=webp&quality=lossless&width=1738&height=1000",
        alt: "Solana Ecosystem Integration Diagram"
      }
    },
    {
      cards: [
        {
          title: "Open Source & Community Driven",
          description: "Built with transparency and collaboration in mind. Our full-stack application is completely open source, community-driven, and welcomes contributions from developers worldwide to shape the future of Solana AI tools."
        },
        {
          title: "AI-Driven Automations & Agents",
          description: "Revolutionize your workflows with powerful AI agents and custom automations designed to handle complex tasks. *Coming soon* to streamline your operations even further."
        }
      ]
    }
  ];

  const faqs = [
    {
      question: "What is Mirage?",
      answer: "Mirage is an AI-powered on-chain token monitoring and trading alert system built for the Solana ecosystem. It combines advanced artificial intelligence with real-time blockchain data to provide traders with actionable insights and automated alerts."
    },
    {
      question: "How does the AI analysis work?",
      answer: "Our platform utilizes state-of-the-art AI models to analyze token metrics, market trends, and on-chain data in real-time. The AI provides insights about token behavior, potential risks, and market opportunities while continuously learning from new data patterns."
    },
    {
      question: "Is Mirage open source?",
      answer: "Yes, Mirage is completely open source. You can find our codebase on GitHub, where we welcome contributions from the community to help improve and expand the platform's capabilities."
    },
    {
      question: "What chains are supported?",
      answer: "Currently, Mirage primarily focuses on the Solana ecosystem. However, we're actively working on expanding support for other major blockchains including Ethereum, BSC, and more in future updates."
    },
    {
      question: "How do I get started?",
      answer: "Simply click the 'Launch App' button to access the Mirage platform. No registration is required, and you can immediately start using our tools for token analysis and market monitoring."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-white overflow-hidden">
      {/* Plexus Animation Background */}
      <PlexusAnimation />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Contract Address */}
          <div className="bg-white/5 backdrop-blur-lg px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
            <span className="text-white/60 text-sm">Contract:</span>
            <span className="text-white font-mono">
              {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
            </span>
            <button 
              onClick={() => copyToClipboard(contractAddress)}
              className="text-white/60 hover:text-white transition-colors"
            >
              {copiedAddress ? (
                <div className="text-green-400 text-xs">Copied!</div>
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-lg p-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <XLogo className="text-white" size={20} />
            </a>
            <a
              href={socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-lg px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <img 
                src="https://media.discordapp.net/attachments/1313203431166709882/1335663319931162704/Pump_fun_logo.png?ex=67a448a6&is=67a2f726&hm=b239041f06d09aad22c671f9737b23d4c63ae3d81321f0478e5d96c1a5c83886&=&format=webp&quality=lossless&width=583&height=583"
                alt="PUMP.FUN"
                className="w-6 h-6 object-contain"
              />
              <ExternalLink className="text-white" size={16} />
            </a>
            <a
              href="https://github.com/StellanovaHub/Stellanova/tree/main"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-lg p-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Github className="text-white" size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-4xl mx-auto z-10">
          {/* Replace title with logo */}
          <div className="relative w-full max-w-2xl mx-auto mb-8">
            <img 
              src="https://media.discordapp.net/attachments/1313203431166709882/1335656754792501401/universal_upscale_0_00b3e10b-6de4-4380-ace3-9b17132e8e7e_0.png?ex=67a4eb49&is=67a399c9&hm=0c36720c74a42af91e117966fbc725029b301a0c7f4801b930b6427e6a077974&=&format=webp&quality=lossless&width=2106&height=867"
              alt="neur/sh Logo"
              className="w-full h-auto"
            />
            {/* Add subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7028E2]/20 via-transparent to-[#00F7FF]/20 blur-3xl -z-10" />
          </div>
          <p className="text-xl text-[#A0A0A0] font-light max-w-2xl mx-auto"
             style={{ fontFamily: "'Inter', sans-serif" }}>
            AI-Powered On-Chain Token Monitoring and Trading Alert System
          </p>
          <div className="flex flex-col items-center gap-4 pt-8">
            {/* Launch Button */}
            <button
              onClick={handleGetStarted}
              className="group relative px-12 py-4 rounded-xl overflow-hidden transition-all duration-500
                       hover:shadow-[0_0_40px_8px_rgba(112,40,226,0.3)]"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#7028E2] via-[#4A90E2] to-[#00F7FF] opacity-100 group-hover:opacity-90 transition-opacity" />
              
              {/* Animated border */}
              <div className="absolute inset-[1px] rounded-xl bg-[#0A0A0A] z-10" />
              
              {/* Animated glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-[#7028E2] to-[#00F7FF] blur-xl" />
                <div className="absolute -inset-[100%] animate-[spin_3s_linear_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              
              {/* Button content */}
              <div className="relative z-20 flex items-center gap-3">
                <span className="text-lg font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Launch App
                </span>
                <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
              </div>
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#7028E2] rounded-tl z-20" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00F7FF] rounded-tr z-20" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#7028E2] rounded-bl z-20" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00F7FF] rounded-br z-20" />
              
              {/* Hover effect particles */}
              <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </button>

            {/* Whitepaper Button */}
            <a
              href="https://mirage-6.gitbook.io/mirage"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-12 py-4 rounded-xl overflow-hidden transition-all duration-500
                       hover:shadow-[0_0_20px_4px_rgba(112,40,226,0.2)]"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#7028E2]/20 via-[#4A90E2]/20 to-[#00F7FF]/20 opacity-100 group-hover:opacity-90 transition-opacity" />
              
              {/* Animated border */}
              <div className="absolute inset-[1px] rounded-xl bg-[#0A0A0A] z-10" />
              
              {/* Animated glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-[#7028E2]/10 to-[#00F7FF]/10 blur-xl" />
                <div className="absolute -inset-[100%] animate-[spin_3s_linear_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
              
              {/* Button content */}
              <div className="relative z-20 flex items-center gap-3">
                <span className="text-lg font-medium bg-gradient-to-r from-white/80 via-blue-100/80 to-white/80 bg-clip-text text-transparent">
                  Whitepaper
                </span>
                <ExternalLink className="w-5 h-5 text-white/80 transform group-hover:translate-x-1 transition-transform" />
              </div>
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#7028E2]/30 rounded-tl z-20" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00F7FF]/30 rounded-tr z-20" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#7028E2]/30 rounded-bl z-20" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00F7FF]/30 rounded-br z-20" />
              
              {/* Hover effect particles */}
              <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-scroll" />
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="fade-in-section relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7028E2]/10 to-[#00F7FF]/10 blur-3xl" />
          <div className="relative">
            {/* Video Container */}
            <div 
              ref={videoRef}
              className="aspect-video rounded-2xl overflow-hidden bg-[#12131f]/60 backdrop-blur-xl border border-white/10 relative"
            >
              {!isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Thumbnail */}
                  <img 
                    src="https://i.ytimg.com/vi/w-N7BtEH-Ac/maxresdefault.jpg"
                    alt="Video Thumbnail"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Play Button */}
                  <button
                    onClick={handlePlayVideo}
                    className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl
                             border border-white/20 flex items-center justify-center
                             hover:bg-white/20 transition-all duration-300 group"
                  >
                    <Play className="w-8 h-8 text-white fill-white transform group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/w-N7BtEH-Ac?autoplay=1"
                  title="neur/sh Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#7028E2] opacity-50" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#00F7FF] opacity-50" />
            <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-1 h-12 bg-gradient-to-b from-[#7028E2] to-transparent opacity-50" />
            <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-1 h-12 bg-gradient-to-b from-[#00F7FF] to-transparent opacity-50" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        {features.map((section, index) => (
          <div key={index} className="fade-in-section">
            {section.title && (
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">{section.title}</h2>
                {section.subtitle && (
                  <p className="text-gray-400 text-lg">{section.subtitle}</p>
                )}
              </div>
            )}

            {section.cards && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.cards.map((card, cardIndex) => (
                  <div
                    key={cardIndex}
                    className="relative group bg-[#0C0C0C] rounded-2xl p-8 border border-[#222] hover:border-[#333] transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7028E2]/5 to-[#00F7FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    <div className="relative">
                      <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.integrationImage && (
              <div className="mt-16">
                <p className="text-gray-400 text-lg text-center mb-12">{section.description}</p>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#0C0C0C] border border-[#222]">
                  {section.integrationImage.placeholder ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#7028E2]/20 to-[#00F7FF]/20 animate-pulse" />
                      <p className="absolute text-gray-500">Integration diagram placeholder</p>
                    </div>
                  ) : (
                    <img
                      src={section.integrationImage.url}
                      alt={section.integrationImage.alt}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16 fade-in-section">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg">Everything you need to know about Mirage</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="fade-in-section bg-[#0C0C0C] rounded-2xl overflow-hidden border border-[#222] hover:border-[#333] transition-all duration-500"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold mb-4">{faq.question}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <img 
                src="https://media.discordapp.net/attachments/1313203431166709882/1335656754792501401/universal_upscale_0_00b3e10b-6de4-4380-ace3-9b17132e8e7e_0.png?ex=67a4eb49&is=67a399c9&hm=0c36720c74a42af91e117966fbc725029b301a0c7f4801b930b6427e6a077974&=&format=webp&quality=lossless&width=2106&height=867"
                alt="Mirage Logo"
                className="h-12 object-contain"
              />
              <p className="text-gray-400 text-sm">
                Next-generation AI-powered token monitoring and trading alert system for the Solana ecosystem.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://mirage-6.gitbook.io/mirage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/StellanovaHub/Stellanova/tree/main"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-lg font-bold mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a 
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Website
                  </a>
                </li>
              </ul>
            </div>

            {/* Contract */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contract</h3>
              <div className="flex items-center gap-2 bg-[#0C0C0C] p-3 rounded-lg border border-[#222]">
                <span className="text-sm font-mono text-gray-400">
                  {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                </span>
                <button
                  onClick={() => copyToClipboard(contractAddress)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#222] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Mirage. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XLogo size={20} />
              </a>
              <a
                href="https://github.com/StellanovaHub/Stellanova/tree/main"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;