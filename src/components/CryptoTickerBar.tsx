import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import { useCryptoPrices } from '../context/CryptoPriceContext';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
}

const CryptoTickerBar = () => {
  const { updatePrices } = useCryptoPrices();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localPrices, setLocalPrices] = useState<CryptoPrice[]>([]);

  const cryptoIds = ['bitcoin', 'ethereum', 'solana', 'ripple', 'cardano', 'chainlink', 'avalanche', 'polkadot', 'matic-network', 'dogecoin'];

  const fetchPrices = async () => {
    try {
      const response = await axios.get('https://api.coincap.io/v2/assets', {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_COINCAP_API_KEY}`
        },
        params: {
          ids: cryptoIds.join(',')
        }
      });

      const filteredPrices = response.data.data
        .sort((a: CryptoPrice, b: CryptoPrice) => 
          cryptoIds.indexOf(a.id) - cryptoIds.indexOf(b.id)
        );

      setLocalPrices(filteredPrices);
      updatePrices(filteredPrices);
      setError(null);
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError('Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1) {
      return numPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return numPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  const formatChange = (change: string) => {
    const numChange = parseFloat(change);
    if (isNaN(numChange)) return '0.00%';
    return `${numChange >= 0 ? '+' : ''}${numChange.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-10 backdrop-blur-sm z-50">
        <div className="h-full flex items-center justify-center">
          <div className="text-blue-400 text-sm animate-pulse">Synchronizing market data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-10 backdrop-blur-sm z-50">
        <div className="h-full flex items-center justify-center">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 backdrop-blur-sm z-50">
      <div className="relative h-full flex items-center">
        <div className="animate-scroll-x flex items-center gap-6 px-6">
          {localPrices.map((crypto) => (
            <div 
              key={crypto.id} 
              className="flex items-center gap-3 whitespace-nowrap group"
            >
              <div className="flex items-center gap-2">
                <span className="text-blue-100 font-medium text-sm group-hover:text-blue-300 transition-colors">
                  {crypto.symbol.toUpperCase()}
                </span>
                <span className="text-blue-200/40 text-xs">/</span>
                <span className="text-blue-200/60 text-xs">USD</span>
              </div>
              <span className="text-blue-100 font-medium text-sm group-hover:text-blue-300 transition-colors">
                {formatPrice(crypto.priceUsd)}
              </span>
              <div className={`flex items-center gap-1 ${
                parseFloat(crypto.changePercent24Hr) >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {parseFloat(crypto.changePercent24Hr) >= 0 
                  ? <TrendingUp size={14} className="group-hover:animate-pulse" /> 
                  : <TrendingDown size={14} className="group-hover:animate-pulse" />
                }
                <span className="text-xs font-medium">
                  {formatChange(crypto.changePercent24Hr)}
                </span>
              </div>
            </div>
          ))}
          {/* Duplicate prices for seamless scrolling */}
          {localPrices.map((crypto) => (
            <div 
              key={`${crypto.id}-duplicate`} 
              className="flex items-center gap-3 whitespace-nowrap group"
            >
              <div className="flex items-center gap-2">
                <span className="text-blue-100 font-medium text-sm group-hover:text-blue-300 transition-colors">
                  {crypto.symbol.toUpperCase()}
                </span>
                <span className="text-blue-200/40 text-xs">/</span>
                <span className="text-blue-200/60 text-xs">USD</span>
              </div>
              <span className="text-blue-100 font-medium text-sm group-hover:text-blue-300 transition-colors">
                {formatPrice(crypto.priceUsd)}
              </span>
              <div className={`flex items-center gap-1 ${
                parseFloat(crypto.changePercent24Hr) >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {parseFloat(crypto.changePercent24Hr) >= 0 
                  ? <TrendingUp size={14} className="group-hover:animate-pulse" /> 
                  : <TrendingDown size={14} className="group-hover:animate-pulse" />
                }
                <span className="text-xs font-medium">
                  {formatChange(crypto.changePercent24Hr)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoTickerBar;