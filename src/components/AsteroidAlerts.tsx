import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import DraggableWindow from './DraggableWindow';

interface BoostToken {
  type: 'tokenProfile' | 'communityTakeover' | 'tokenAd' | 'trendingBarAd';
  status: 'processing' | 'cancelled' | 'on-hold' | 'approved' | 'rejected';
  paymentTimestamp: number;
}

interface AsteroidAlertsProps {
  onClose: () => void;
}

const AsteroidAlerts: React.FC<AsteroidAlertsProps> = ({ onClose }) => {
  const [tokens, setTokens] = useState<BoostToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBoostedTokens = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('https://api.dexscreener.com/orders/v1/top/boosts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }

      const data = await response.json();
      setTokens(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error checking orders:', err);
      setError('Failed to fetch order data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBoostedTokens();
    const interval = setInterval(fetchBoostedTokens, 30000);
    return () => clearInterval(interval);
  }, []);

  const truncateAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const headerActions = (
    <button
      onClick={fetchBoostedTokens}
      disabled={refreshing}
      className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50 text-sm"
    >
      <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
      Refresh
    </button>
  );

  return (
    <DraggableWindow
      title="ASTEROID WATCHTOWER"
      onClose={onClose}
      width="800px"
      defaultPosition={{ x: 400, y: 96 }}
      headerActions={headerActions}
    >
      {/* Component content */}
    </DraggableWindow>
  );
};

export default AsteroidAlerts;