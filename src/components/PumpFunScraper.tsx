import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, ExternalLink, AlertCircle } from 'lucide-react';
import axios from 'axios';
import DraggableWindow from './DraggableWindow';

interface PumpFunScraperProps {
  onClose: () => void;
}

interface ScrapedToken {
  name: string;
  symbol: string;
  price: string;
  marketCap: string;
  volume24h: string;
  holders: string;
  description?: string;
  socialLinks?: {
    twitter?: string;
    telegram?: string;
    website?: string;
  };
}

const PumpFunScraper = ({ onClose }: PumpFunScraperProps) => {
  const [tokens, setTokens] = useState<ScrapedToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTokens = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use axios to fetch data from the Apify API
      const response = await axios.post(
        'https://api.apify.com/v2/acts/louisdeconinck~pump-fun-crypto-coin-scraper/runs?token=apify_api_L2NSeMrALhtbsTQIY3X4JtZjA3MNf73ubyUD'
      );

      const runId = response.data.data.id;

      // Poll for results
      let results = null;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      while (!results && attempts < maxAttempts) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between checks
        
        const statusResponse = await axios.get(
          `https://api.apify.com/v2/acts/louisdeconinck~pump-fun-crypto-coin-scraper/runs/${runId}?token=apify_api_L2NSeMrALhtbsTQIY3X4JtZjA3MNf73ubyUD`
        );

        if (statusResponse.data.data.status === 'SUCCEEDED') {
          const datasetResponse = await axios.get(
            `https://api.apify.com/v2/acts/louisdeconinck~pump-fun-crypto-coin-scraper/runs/${runId}/dataset/items?token=apify_api_L2NSeMrALhtbsTQIY3X4JtZjA3MNf73ubyUD`
          );
          results = datasetResponse.data;
        }
      }

      if (!results) {
        throw new Error('Timeout waiting for results');
      }

      setTokens(results as ScrapedToken[]);
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to fetch token data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerActions = (
    <button
      onClick={fetchTokens}
      disabled={loading}
      className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50 text-sm"
    >
      <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
      Refresh
    </button>
  );

  return (
    <DraggableWindow
      title="PUMPFUN SCRAPER"
      onClose={onClose}
      width="800px"
      defaultPosition={{ x: 32, y: 96 }}
      headerActions={headerActions}
    >
      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tokens..."
            className="w-full bg-[#12131f] text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Tokens List */}
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="bg-[#12131f] p-6 rounded-lg border border-white/10 text-center">
            <p className="text-white/60">No tokens found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTokens.map((token, index) => (
              <div
                key={index}
                className="bg-[#12131f] p-4 rounded-lg border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{token.name}</h3>
                      <span className="text-white/40 text-sm">{token.symbol}</span>
                    </div>
                    
                    {token.description && (
                      <p className="text-white/60 text-sm max-w-xl">
                        {token.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-white/40 text-xs">Price</p>
                        <p className="text-white font-medium">{token.price}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Market Cap</p>
                        <p className="text-white font-medium">{token.marketCap}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">24h Volume</p>
                        <p className="text-white font-medium">{token.volume24h}</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {token.socialLinks && (
                    <div className="flex gap-2">
                      {token.socialLinks.twitter && (
                        <a
                          href={token.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400/60 hover:text-blue-400 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {token.socialLinks.telegram && (
                        <a
                          href={token.socialLinks.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400/60 hover:text-blue-400 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {token.socialLinks.website && (
                        <a
                          href={token.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400/60 hover:text-blue-400 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DraggableWindow>
  );
};

export default PumpFunScraper;