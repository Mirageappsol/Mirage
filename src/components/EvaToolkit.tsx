import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2, XCircle, Clock, Loader2, ExternalLink, ListPlus } from 'lucide-react';
import DraggableWindow from './DraggableWindow';
import TokenProfiles from './TokenProfiles';

interface BoostToken {
  type: 'tokenProfile' | 'communityTakeover' | 'tokenAd' | 'trendingBarAd';
  status: 'processing' | 'cancelled' | 'on-hold' | 'approved' | 'rejected';
  paymentTimestamp: number;
}

interface EvaToolkitProps {
  onClose: () => void;
}

const EvaToolkit: React.FC<EvaToolkitProps> = ({ onClose }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [chainId, setChainId] = useState('solana');
  const [isChecking, setIsChecking] = useState(false);
  const [orders, setOrders] = useState<BoostToken[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTokenProfiles, setShowTokenProfiles] = useState(false);

  const handleCheck = async () => {
    if (!contractAddress) return;
    
    setIsChecking(true);
    setError(null);
    setOrders([]);

    try {
      const response = await fetch(
        `https://api.dexscreener.com/orders/v1/${chainId}/${contractAddress}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }

      const data = await response.json();
      
      // Handle both single order and array of orders
      const ordersList = Array.isArray(data) ? data : [data];
      
      // Filter and validate orders
      const validOrders = ordersList.filter(order => 
        order && 
        order.type && 
        order.status && 
        order.paymentTimestamp
      );

      setOrders(validOrders);
    } catch (err) {
      console.error('Error checking orders:', err);
      setError('Failed to fetch order data. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = (status: BoostToken['status']) => {
    const colors = {
      'approved': 'text-green-500',
      'processing': 'text-yellow-500',
      'on-hold': 'text-orange-500',
      'rejected': 'text-red-500',
      'cancelled': 'text-gray-500'
    };
    return colors[status] || 'text-white';
  };

  const getStatusIcon = (status: BoostToken['status']) => {
    const icons = {
      'approved': <CheckCircle2 size={20} className="text-green-500" />,
      'processing': <Loader2 size={20} className="text-yellow-500 animate-spin" />,
      'on-hold': <Clock size={20} className="text-orange-500" />,
      'rejected': <XCircle size={20} className="text-red-500" />,
      'cancelled': <XCircle size={20} className="text-gray-500" />
    };
    return icons[status] || null;
  };

  const formatOrderType = (type: BoostToken['type']) => {
    const types = {
      'tokenProfile': 'Token Profile',
      'communityTakeover': 'Community Takeover',
      'tokenAd': 'Token Advertisement',
      'trendingBarAd': 'Trending Bar Ad'
    };
    return types[type] || type;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <DraggableWindow
        title="DEX CHECKER"
        onClose={onClose}
        width="600px"
        defaultPosition={{ x: window.innerWidth - 632, y: 96 }}
      >
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Chain</label>
              <select
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                className="w-full bg-[#12131f] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
              >
                <option value="solana">Solana</option>
                <option value="ethereum">Ethereum</option>
                <option value="bsc">BSC</option>
                <option value="polygon">Polygon</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="optimism">Optimism</option>
                <option value="base">Base</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-white/70 text-sm">Contract Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="Enter contract address..."
                  className="w-full bg-[#12131f] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                />
                <button
                  onClick={handleCheck}
                  disabled={isChecking || !contractAddress}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600/20 to-purple-400/20 text-purple-400 px-4 py-2 rounded-lg hover:from-purple-600/30 hover:to-purple-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-orbitron tracking-wide text-xs"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      CHECKING
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      CHECK
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Latest Token Profiles Button */}
          <button
            onClick={() => setShowTokenProfiles(true)}
            className="w-full bg-gradient-to-r from-[#7028E2] to-[#00F7FF] text-white py-4 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-3 font-orbitron tracking-wider text-lg relative group overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7028E2] via-[#00F7FF] to-[#7028E2] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Button content */}
            <div className="relative z-10 flex items-center gap-3">
              <ListPlus className="w-6 h-6" />
              <span>VIEW LAST DEX PAID TOKENS</span>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 border border-[#7028E2]/20 rounded-lg" />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#7028E2]/50 rounded-tl" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00F7FF]/50 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#7028E2]/50 rounded-bl" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00F7FF]/50 rounded-br" />
          </button>

          {/* Results Section */}
          {error ? (
            <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div 
                  key={index}
                  className="bg-[#12131f] p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-white font-semibold">
                          {formatOrderType(order.type)}
                        </h3>
                        <p className={`${getStatusColor(order.status)} text-sm`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">Payment Date</p>
                      <p className="text-white text-sm">
                        {formatDate(order.paymentTimestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-xs mb-1">Chain</p>
                        <p className="text-white font-medium">{chainId.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Contract</p>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-mono text-sm">
                            {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                          </p>
                          <a
                            href={`https://dexscreener.com/${chainId}/${contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400/60 hover:text-blue-400 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !isChecking && contractAddress && (
            <div className="bg-[#12131f]/50 p-4 rounded-lg">
              <p className="text-white/60 text-center">
                No orders found for this contract. Enter a contract address and click the search button to check for orders.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-[#12131f]/50 p-4 rounded-lg">
            <p className="text-white/60 text-sm">
              Enter a contract address to verify DexScreener orders and their status. 
              The DEX checker will check for token profiles, ads, and community takeovers.
            </p>
          </div>
        </div>
      </DraggableWindow>

      {/* Token Profiles Modal */}
      {showTokenProfiles && (
        <TokenProfiles onClose={() => setShowTokenProfiles(false)} />
      )}
    </>
  );
};

export default EvaToolkit;