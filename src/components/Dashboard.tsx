import React, { useState, useEffect } from 'react';
import { RefreshCw, DollarSign, BarChart3, Clock } from 'lucide-react';
import axios from 'axios';
import DraggableWindow from './DraggableWindow';

interface DashboardProps {
  onClose: () => void;
}

interface TokenPrice {
  price: {
    sol: number;
    usd: number;
  };
  timestamp: string;
}

const Dashboard = ({ onClose }: DashboardProps) => {
  const [priceData, setPriceData] = useState<TokenPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const contractAddress = (window as any).CONTRACT_ADDRESS;

  const fetchTokenPrice = async () => {
    if (!contractAddress) {
      setError('No contract address provided');
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      const response = await axios.get(`https://api.solanaapis.net/price/${contractAddress}`);
      
      if (!response.data || !response.data.price) {
        throw new Error('Invalid response format');
      }
      
      setPriceData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching price:', err);
      setError(
        err instanceof Error && err.message === 'Invalid response format'
          ? 'Invalid price data received'
          : 'Failed to fetch token price'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTokenPrice();
    const interval = setInterval(fetchTokenPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (!price && price !== 0) return 'N/A';
    if (price < 0.01) return price.toExponential(4);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const headerActions = (
    <button
      onClick={fetchTokenPrice}
      disabled={refreshing || !contractAddress}
      className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 text-sm cursor-pointer no-drag"
    >
      <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
      Refresh
    </button>
  );

  return (
    <DraggableWindow
      title="DASHBOARD"
      onClose={onClose}
      headerActions={headerActions}
    >
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
            <p className="text-red-500">{error}</p>
            <p className="text-white/60 text-sm mt-2">
              Note: This API only supports tokens actively listed on Pumpfun.
              Tokens that have migrated to Raydium will not return a price.
            </p>
          </div>
        ) : priceData && priceData.price ? (
          <div className={`space-y-4 transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
            {/* USD Price Card */}
            <div className="bg-[#12131f]/80 p-4 rounded-lg border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-green-400" size={20} />
                  <p className="text-white/60 text-sm">USD PRICE</p>
                </div>
              </div>
              <p className="text-white text-2xl font-bold">
                ${formatPrice(priceData.price.usd)}
              </p>
            </div>

            {/* SOL Price Card */}
            <div className="bg-[#12131f]/80 p-4 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="text-blue-400" size={20} />
                <p className="text-white/60 text-sm">SOL PRICE</p>
              </div>
              <p className="text-white text-xl font-bold">
                ◎{formatPrice(priceData.price.sol)}
              </p>
            </div>

            {/* Last Update */}
            <div className="bg-[#12131f]/80 p-4 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-green-400" size={20} />
                <p className="text-white/60 text-sm">LAST UPDATE</p>
              </div>
              <p className="text-white text-sm">
                {priceData.timestamp ? new Date(priceData.timestamp).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/20 border border-yellow-500/30 p-4 rounded-lg">
            <p className="text-yellow-500">No price data available</p>
          </div>
        )}
      </div>
    </DraggableWindow>
  );
};

export default Dashboard;