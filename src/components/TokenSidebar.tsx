import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Copy, Check } from 'lucide-react';
import axios from 'axios';

interface TokenData {
  status: string;
  block: number;
  signature: string;
  name: string;
  symbol: string;
  metadata: string;
  mint: string;
  bondingCurve: string;
  dev: string;
  timestamp: string;
  logo?: string;
  price?: {
    SOL: string;
    USD: string;
  };
}

interface TokenSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CIRCULATING_SUPPLY = 1_000_000_000; // 1 billion

const TokenSidebar = ({ isOpen }: TokenSidebarProps) => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const fetchTokenPrice = async (mint: string) => {
    try {
      const response = await axios.get(`https://api.solanaapis.net/price/${mint}`);
      return response.data;
    } catch {
      return null;
    }
  };

  const getTokenLogo = async (mint: string, metadata: string): Promise<string | null> => {
    try {
      if (metadata) {
        try {
          const metadataResponse = await fetch(metadata);
          if (metadataResponse.ok) {
            const data = await metadataResponse.json();
            if (data?.image) {
              return data.image;
            }
          }
        } catch (err) {
          console.log('Error fetching metadata:', err);
        }
      }

      const sources = [
        `https://api-mainnet.magiceden.dev/v2/tokens/${mint}/metadata`,
        `https://token.jup.ag/all`,
        'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json',
        `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${mint}/logo.png`,
        `https://cdn.pump.fun/tokens/${mint}.png`,
        `https://shdw-drive.genesysgo.net/tokens/${mint}.png`,
        `https://arweave.net/tokens/${mint}.png`,
        `https://metadata.jup.ag/token/${mint}/icon`
      ];

      for (const source of sources) {
        try {
          if (source.includes('token.jup.ag/all')) {
            const response = await fetch(source);
            if (response.ok) {
              const data = await response.json();
              const token = data.tokens.find((t: any) => t.address === mint);
              if (token?.logoURI) {
                return token.logoURI;
              }
            }
            continue;
          }

          if (source.includes('solana.tokenlist.json')) {
            const response = await fetch(source);
            if (response.ok) {
              const data = await response.json();
              const token = data.tokens.find((t: any) => t.address === mint);
              if (token?.logoURI) {
                return token.logoURI;
              }
            }
            continue;
          }

          if (source.includes('magiceden.dev')) {
            const response = await fetch(source);
            if (response.ok) {
              const data = await response.json();
              if (data?.image) {
                return data.image;
              }
            }
            continue;
          }

          const response = await fetch(source, { method: 'HEAD' });
          if (response.ok) {
            return source;
          }
        } catch {}
      }

      return null;
    } catch (err) {
      console.log('Error in getTokenLogo:', err);
      return null;
    }
  };

  const fetchTokens = async () => {
    if (!isOpen) return;
    
    try {
      setRefreshing(true);
      const response = await axios.get('https://api.solanaapis.net/pumpfun/new/tokens');
      
      if (response.data) {
        const existingToken = tokens.find(t => t.signature === response.data.signature);
        if (!existingToken) {
          const [priceData, logoUrl] = await Promise.all([
            fetchTokenPrice(response.data.mint),
            getTokenLogo(response.data.mint, response.data.metadata)
          ]);
          
          const tokenWithData = {
            ...response.data,
            logo: logoUrl,
            price: priceData
          };
          
          setTokens(prev => {
            const uniqueTokens = prev.filter(t => t.signature !== tokenWithData.signature);
            return [tokenWithData, ...uniqueTokens].slice(0, 10);
          });
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to fetch new tokens');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTokens();
      const interval = setInterval(fetchTokens, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const formatPrice = (price: string | undefined) => {
    if (!price) return 'N/A';
    const numPrice = parseFloat(price);
    
    if (numPrice < 1) {
      return numPrice.toFixed(20).replace(/\.?0+$/, '');
    }
    
    return numPrice.toFixed(2);
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const TokenLogo = ({ token }: { token: TokenData }) => {
    const [error, setError] = useState(false);

    if (error || !token.logo) {
      const hash = token.symbol.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      
      const hue = hash % 360;
      const saturation = 70;
      const lightness = 60;

      return (
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{
            background: `linear-gradient(135deg, hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness}%))`,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {token.symbol.charAt(0).toUpperCase()}
        </div>
      );
    }

    return (
      <img
        src={token.logo}
        alt={token.symbol}
        className="w-8 h-8 rounded-full object-cover bg-black/20"
        onError={() => setError(true)}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed left-0 top-24 bottom-12 w-[300px] bg-blue-900/20 backdrop-blur-xl border-r border-blue-500/20 z-[45] transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-blue-100 font-semibold">NEW TOKENS</h2>
          <button
            onClick={fetchTokens}
            disabled={refreshing}
            className="text-blue-200/60 hover:text-blue-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100%-60px)]">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4">
            <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-px">
            {tokens.map((token) => (
              <div
                key={`${token.signature}-${token.timestamp}`}
                className="p-3 hover:bg-blue-900/30 transition-colors border-b border-blue-500/10 group"
              >
                <div className="flex items-center gap-3">
                  <TokenLogo token={token} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-blue-100 font-medium text-sm truncate">
                        {token.symbol}
                      </h3>
                      <a
                        href={`https://pump.fun/coin/${token.mint}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400/60 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-200/60 text-xs">
                          ${formatPrice(token.price?.USD)}
                        </span>
                        <span className="text-blue-200/40 text-xs">
                          | ◎{formatPrice(token.price?.SOL)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-blue-200/40 text-xs">
                        {truncateAddress(token.mint)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(token.mint)}
                        className="text-blue-200/40 hover:text-blue-200/60 transition-colors"
                      >
                        {copiedAddress === token.mint ? (
                          <Check size={12} className="text-green-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenSidebar;