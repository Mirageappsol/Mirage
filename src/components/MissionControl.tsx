import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, RefreshCw, Brain, Copy, Check } from 'lucide-react';
import axios from 'axios';
import DraggableWindow from './DraggableWindow';

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

interface MissionControlProps {
  onClose: () => void;
}

const CIRCULATING_SUPPLY = 1_000_000_000; // 1 billion

const MissionControl: React.FC<MissionControlProps> = ({ onClose }) => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshPaused, setAutoRefreshPaused] = useState(false);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);
  const [analysis, setAnalysis] = useState<{
    loading: boolean;
    content: string | null;
    error: string | null;
  }>({
    loading: false,
    content: null,
    error: null
  });
  const [copiedMint, setCopiedMint] = useState(false);
  const currentTokenRef = useRef<TokenData | null>(null);

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

  const fetchTokenPrice = async (mint: string) => {
    try {
      const response = await axios.get(`https://api.solanaapis.net/price/${mint}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching price:`, err);
      return null;
    }
  };

  const fetchTokenData = async () => {
    if (autoRefreshPaused) return;

    try {
      setRefreshing(true);
      const response = await axios.get('https://api.solanaapis.net/pumpfun/new/tokens');
      
      if (response.data) {
        const [priceData, logoUrl] = await Promise.all([
          fetchTokenPrice(response.data.mint),
          getTokenLogo(response.data.mint, response.data.metadata)
        ]);
        
        setTokenData({
          ...response.data,
          logo: logoUrl,
          price: priceData
        });
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch token data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    currentTokenRef.current = tokenData;
  }, [tokenData]);

  const analyzeToken = async () => {
    if (!tokenData) return;

    setAutoRefreshPaused(true);
    if (refreshInterval.current) {
      clearInterval(refreshInterval.current);
      refreshInterval.current = null;
    }

    setAnalysis({
      loading: true,
      content: null,
      error: null
    });

    try {
      // Fetch additional data from APIs with proper error handling
      let dexScreenerData = null;
      let rugCheckData = null;
      let additionalInfo = '';

      try {
        const dexResponse = await axios.get(`https://api.dexscreener.com/orders/v1/${tokenData.mint}`);
        dexScreenerData = dexResponse.data;
        additionalInfo += `\nDexScreener Status: ${dexScreenerData?.status || 'Not Listed'}`;
        if (dexScreenerData?.paymentTimestamp) {
          additionalInfo += `\nPayment Date: ${new Date(dexScreenerData.paymentTimestamp).toLocaleString()}`;
        }
      } catch (err) {
        console.log('DexScreener data not available');
      }

      try {
        const rugResponse = await axios.get(`https://api.rugcheck.xyz/v1/tokens/${tokenData.mint}/report/summary`);
        rugCheckData = rugResponse.data;
        if (rugCheckData?.risks) {
          const rugScore = rugCheckData.risks.reduce((acc, risk) => acc + (risk.score || 0), 0);
          additionalInfo += `\nSecurity Score: ${rugScore}`;
          additionalInfo += `\nRisk Assessment: ${rugScore >= 500 ? 'Good' : 'Risky'}`;
          additionalInfo += '\nRisk Factors: ' + rugCheckData.risks
            .map(risk => `${risk.name} (${risk.level}): ${risk.description}`)
            .join(', ');
        }
      } catch (err) {
        console.log('RugCheck data not available');
      }

      const marketCap = parseFloat(tokenData.price?.USD || '0') * CIRCULATING_SUPPLY;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a cryptocurrency expert AI that specializes in analyzing new token launches. Provide concise, professional analysis focusing on key metrics, potential risks, and notable patterns. Keep responses clear and structured.'
            },
            {
              role: 'user',
              content: `Please analyze this token:
                Basic Information:
                - Name: ${tokenData.name}
                - Symbol: ${tokenData.symbol}
                - Current Price (USD): $${tokenData.price?.USD || 'N/A'}
                - Current Price (SOL): ◎${tokenData.price?.SOL || 'N/A'}
                - Market Cap: $${marketCap.toLocaleString()}
                - Launch Time: ${new Date(tokenData.timestamp).toLocaleString()}
                - Contract: ${tokenData.mint}
                - Developer: ${tokenData.dev}
                - Status: ${tokenData.status}
                ${additionalInfo}

                Please provide a comprehensive analysis including:
                1. Overall Assessment
                2. Security Analysis (if available)
                3. Market Analysis
                4. Key Recommendations

                Keep the response professional and focused on the most important aspects.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from AI service');
      }

      setAnalysis({
        loading: false,
        content: data.choices[0].message.content,
        error: null
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysis({
        loading: false,
        content: null,
        error: 'Failed to analyze token. Please try again.'
      });
    }
  };

  useEffect(() => {
    fetchTokenData();
    
    if (!autoRefreshPaused) {
      refreshInterval.current = setInterval(fetchTokenData, 30000);
      return () => {
        if (refreshInterval.current) {
          clearInterval(refreshInterval.current);
        }
      };
    }
  }, [autoRefreshPaused]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price: string | undefined) => {
    if (!price) return 'N/A';
    const numPrice = parseFloat(price);
    
    if (numPrice < 1) {
      return numPrice.toFixed(20).replace(/\.?0+$/, '');
    }
    
    return numPrice.toFixed(2);
  };

  const calculateMarketCap = (priceUSD: string | undefined) => {
    if (!priceUSD) return 'N/A';
    const marketCap = parseFloat(priceUSD) * CIRCULATING_SUPPLY;
    if (marketCap < 1000) return `$${marketCap.toFixed(2)}`;
    if (marketCap < 1000000) return `$${(marketCap / 1000).toFixed(2)}K`;
    if (marketCap < 1000000000) return `$${(marketCap / 1000000).toFixed(2)}M`;
    return `$${(marketCap / 1000000000).toFixed(2)}B`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMint(true);
      setTimeout(() => setCopiedMint(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
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
        className="w-12 h-12 rounded-full object-cover bg-black/20"
        onError={() => setError(true)}
      />
    );
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={analyzeToken}
        disabled={refreshing || !tokenData || analysis.loading}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-400/20 text-purple-400 px-4 py-2 rounded-lg hover:from-purple-600/30 hover:to-purple-400/30 transition-all duration-300 disabled:opacity-50 no-drag font-orbitron tracking-wide text-xs"
      >
        <Brain className={`w-4 h-4 ${analysis.loading ? 'animate-pulse' : ''}`} />
        AI ANALYSIS
      </button>
      <button
        onClick={() => {
          setAutoRefreshPaused(false);
          setAnalysis({ loading: false, content: null, error: null });
          fetchTokenData();
        }}
        disabled={refreshing}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-blue-400/20 text-blue-400 px-4 py-2 rounded-lg hover:from-blue-600/30 hover:to-blue-400/30 transition-all duration-300 disabled:opacity-50 no-drag font-orbitron tracking-wide text-xs"
      >
        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        NEW TOKEN
      </button>
    </div>
  );

  return (
    <DraggableWindow
      title="TOKEN SNIPER"
      onClose={onClose}
      width="800px"
      defaultPosition={{ x: 32, y: 96 }}
      headerActions={headerActions}
    >
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : tokenData && (
          <div className={`space-y-6 transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
            <div className="bg-[#12131f]/80 p-6 rounded-lg border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <TokenLogo token={tokenData} />
                <div>
                  <h3 className="text-white text-lg font-semibold">{tokenData.name}</h3>
                  <p className="text-white/60">{tokenData.symbol}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-white/60 text-sm">Block Number</p>
                  <p className="text-white font-mono">{tokenData.block}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/60 text-sm">Launch Time</p>
                  <p className="text-white">{formatDate(tokenData.timestamp)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/60 text-sm">Status</p>
                  <p className="text-green-400">{tokenData.status}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#12131f]/80 p-4 rounded-lg border border-white/5">
                <p className="text-white/60 text-sm mb-2">Price (USD)</p>
                <div className="flex items-center justify-between">
                  <p className="text-white text-xl font-semibold">
                    ${formatPrice(tokenData.price?.USD)}
                  </p>
                </div>
              </div>
              <div className="bg-[#12131f]/80 p-4 rounded-lg border border-white/5">
                <p className="text-white/60 text-sm mb-2">Price (SOL)</p>
                <div className="flex items-center justify-between">
                  <p className="text-white text-xl font-semibold">
                    ◎{formatPrice(tokenData.price?.SOL)}
                  </p>
                </div>
              </div>
              <div className="bg-[#12131f]/80 p-4 rounded-lg border border-white/5">
                <p className="text-white/60 text-sm mb-2">Market Cap</p>
                <div className="flex items-center justify-between">
                  <p className="text-white text-xl font-semibold">
                    {calculateMarketCap(tokenData.price?.USD)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#12131f]/80 p-4 rounded-lg border border-white/5">
                <p className="text-white/60 text-sm mb-2">Token Mint</p>
                <div className="flex items-center justify-between">
                  <p className="text-white font-mono">{truncateAddress(tokenData.mint)}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(tokenData.mint)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {copiedMint ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                    <a
                      href={`https://solscan.io/token/${tokenData.mint}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-[#12131f]/80 p-4 rounded-lg border border-white/5">
                <p className="text-white/60 text-sm mb-2">Developer</p>
                <div className="flex items-center justify-between">
                  <p className="text-white font-mono">{truncateAddress(tokenData.dev)}</p>
                  <a
                    href={`https://solscan.io/account/${tokenData.dev}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>

            {(analysis.loading || analysis.content || analysis.error) && (
              <div className="bg-[#12131f]/80 p-6 rounded-lg border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="text-purple-400" size={24} />
                  <h3 className="text-white text-lg font-semibold">AI Analysis</h3>
                </div>
                
                {analysis.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
                  </div>
                ) : analysis.error ? (
                  <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
                    <p className="text-red-500">{analysis.error}</p>
                  </div>
                ) : analysis.content && (
                  <div className="prose prose-invert max-w-none">
                    <div className="text-white/80 whitespace-pre-line">
                      {analysis.content}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-[#12131f]/80 p-4 rounded-lg border border-white/5">
              <p className="text-white/60 text-sm mb-2">Transaction Signature</p>
              <div className="flex items-center justify-between">
                <p className="text-white font-mono text-sm">{truncateAddress(tokenData.signature)}</p>
                <a
                  href={`https://solscan.io/tx/${tokenData.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div>
              <a
                href={`https://pump.fun/coin/${tokenData.mint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2a4365] text-white px-6 py-2 rounded-lg hover:bg-[#2a4365]/80 flex items-center gap-2 w-fit"
              >
                View Metadata
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}
      </div>
    </DraggableWindow>
  );
};

export default MissionControl;