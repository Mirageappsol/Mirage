import React, { useState, useEffect } from 'react';
import { Rocket, RefreshCw, Zap, ExternalLink, TrendingUp, Search, Copy, Check } from 'lucide-react';
import axios from 'axios';
import DraggableWindow from './DraggableWindow';

interface StarChartsProps {
  onClose: () => void;
}

interface TokenBoost {
  url: string;
  chainId: string;
  tokenAddress: string;
  amount: number;
  totalAmount: number;
  icon?: string;
  header?: string;
  description?: string;
  links?: Array<{
    type: string;
    label: string;
    url: string;
  }>;
}

const StarCharts: React.FC<StarChartsProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [tokens, setTokens] = useState<TokenBoost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const fetchTopTokens = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await axios.get('https://api.dexscreener.com/token-boosts/top/v1');
      
      if (response.data && Array.isArray(response.data)) {
        // Ensure all required number fields have default values
        const processedTokens = response.data.map((token: TokenBoost) => ({
          ...token,
          amount: token.amount || 0,
          totalAmount: token.totalAmount || 0
        }));
        setTokens(processedTokens);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to fetch token data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTopTokens();
    const interval = setInterval(fetchTopTokens, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: number | undefined) => {
    // Handle undefined or null values
    if (amount === undefined || amount === null) {
      return '$0.00';
    }

    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const filteredTokens = tokens.filter(token => 
    token.tokenAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerActions = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tokens..."
          className="bg-[#12131f] text-white px-4 py-2 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/10 text-sm w-48 font-space-grotesk"
        />
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40" size={14} />
      </div>
      <button
        onClick={fetchTopTokens}
        disabled={refreshing}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-400/20 text-purple-400 px-4 py-2 rounded-lg hover:from-purple-600/30 hover:to-purple-400/30 transition-all duration-300 disabled:opacity-50 no-drag font-orbitron tracking-wide text-xs"
      >
        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        REFRESH
      </button>
    </div>
  );

  return (
    <DraggableWindow
      title="TOKENS WITH MOST ACTIVE BOOSTS"
      onClose={onClose}
      width="800px"
      defaultPosition={{ x: 32, y: 96 }}
      headerActions={headerActions}
    >
      <div className="p-6 space-y-6">
        {error ? (
          <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : refreshing && tokens.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="bg-[#12131f]/50 p-4 rounded-lg">
            <p className="text-white/60 text-center">No tokens found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTokens.map((token, index) => (
              <div
                key={`${token.tokenAddress}-${index}`}
                className="bg-[#12131f] p-4 rounded-lg border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Token Icon */}
                  {token.icon ? (
                    <img
                      src={token.icon}
                      alt="Token Icon"
                      className="w-12 h-12 rounded-full object-cover bg-black/20"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-purple-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold">
                            {truncateAddress(token.tokenAddress)}
                          </h3>
                          <span className="text-white/60 text-sm">
                            {token.chainId.toUpperCase()}
                          </span>
                        </div>
                        {token.description && (
                          <p className="text-white/60 text-sm mt-1 line-clamp-2">
                            {token.description}
                          </p>
                        )}
                      </div>
                      <div className="bg-[#1a1b2e] px-4 py-2 rounded-lg">
                        <div className="text-white/60 text-xs">Total Spent</div>
                        <div className="text-white font-semibold">{formatAmount(token.totalAmount)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-sm">Contract:</span>
                        <span className="text-white/80 font-mono text-sm">
                          {truncateAddress(token.tokenAddress)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(token.tokenAddress)}
                          className="text-white/40 hover:text-white/60 transition-colors"
                        >
                          {copiedAddress === token.tokenAddress ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                        <a
                          href={`https://dexscreener.com/${token.chainId}/${token.tokenAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400/60 hover:text-blue-400 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>

                      {token.links && token.links.length > 0 && (
                        <div className="flex items-center gap-2">
                          {token.links.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400/60 hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                            >
                              {link.label}
                              <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      )}
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

export default StarCharts;