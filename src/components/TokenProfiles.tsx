import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, AlertCircle, Copy, Check } from 'lucide-react';
import DraggableWindow from './DraggableWindow';

interface TokenProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  header?: string;
  description?: string;
  symbol?: string;
  links?: Array<{
    type: string;
    label: string;
    url: string;
  }>;
}

interface TokenProfilesProps {
  onClose: () => void;
}

const TokenProfiles: React.FC<TokenProfilesProps> = ({ onClose }) => {
  const [profiles, setProfiles] = useState<TokenProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1');
      
      if (!response.ok) {
        throw new Error('Failed to fetch token profiles');
      }

      const data = await response.json();
      
      // Extract symbol from header or URL if available
      const processedData = Array.isArray(data) ? data.map((profile: TokenProfile) => {
        let symbol = '';
        if (profile.header) {
          const symbolMatch = profile.header.match(/\$([A-Za-z0-9]+)/);
          if (symbolMatch) {
            symbol = symbolMatch[1];
          }
        }
        if (!symbol && profile.url) {
          const urlMatch = profile.url.match(/\/([A-Za-z0-9]+)pump\/header\.png$/);
          if (urlMatch) {
            symbol = urlMatch[1];
          }
        }
        return { ...profile, symbol };
      }) : [];

      setProfiles(processedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to fetch token profiles. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    const interval = setInterval(fetchProfiles, 60000);
    return () => clearInterval(interval);
  }, []);

  const truncateAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const headerActions = (
    <button
      onClick={fetchProfiles}
      disabled={refreshing}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-400/20 text-purple-400 px-4 py-2 rounded-lg hover:from-purple-600/30 hover:to-purple-400/30 transition-all duration-300 disabled:opacity-50 no-drag font-orbitron tracking-wide text-xs"
    >
      <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
      REFRESH
    </button>
  );

  return (
    <DraggableWindow
      title="LAST DEX PAID TOKENS"
      onClose={onClose}
      width="800px"
      defaultPosition={{ x: window.innerWidth / 2 - 400, y: 96 }}
      headerActions={headerActions}
    >
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-[#12131f]/50 p-4 rounded-lg">
            <p className="text-white/60 text-center">No token profiles found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile, index) => (
              <div
                key={`${profile.tokenAddress}-${index}`}
                className="bg-[#12131f] p-4 rounded-lg border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Token Icon */}
                  {profile.icon ? (
                    <img
                      src={profile.icon}
                      alt={profile.symbol || 'Token'}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/48x48/12131f/white?text=' + 
                          (profile.symbol?.[0] || 'T');
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#12131f] border border-white/10 flex items-center justify-center">
                      <span className="text-white/60 text-lg">
                        {profile.symbol?.[0] || 'T'}
                      </span>
                    </div>
                  )}

                  {/* Token Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {profile.symbol ? `$${profile.symbol}` : truncateAddress(profile.tokenAddress)}
                        </h3>
                        <p className="text-white/60 text-sm mt-1">
                          {profile.chainId.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {profile.description && (
                      <p className="text-white/70 text-sm mt-2">
                        {profile.description}
                      </p>
                    )}

                    {/* Links */}
                    {profile.links && profile.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {profile.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm px-3 py-1 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
                          >
                            {link.label}
                            <ExternalLink size={12} />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Contract Info */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-sm">Contract:</span>
                        <span className="text-white/60 font-mono text-sm">
                          {truncateAddress(profile.tokenAddress)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(profile.tokenAddress)}
                          className="text-white/40 hover:text-white/60 transition-colors"
                        >
                          {copiedAddress === profile.tokenAddress ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-sm">DEX:</span>
                        <a
                          href={`https://dexscreener.com/${profile.chainId}/${profile.tokenAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400/60 hover:text-blue-400 transition-colors flex items-center gap-1"
                        >
                          <span className="text-sm">DexScreener</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DraggableWindow>
  );
};

export default TokenProfiles;