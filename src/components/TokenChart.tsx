import React, { useEffect, useRef, useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { createChart, ColorType, IChartApi, ISeriesApi, LineData } from 'lightweight-charts';
import axios from 'axios';

interface TokenChartProps {
  chainId: string;
  tokenAddress: string;
  tokenName?: string;
  onClose: () => void;
}

interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

const TokenChart = ({ chainId, tokenAddress, tokenName, onClose }: TokenChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use DexScreener API for price data
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
      );

      if (!response.data?.pairs?.[0]?.priceUsd) {
        throw new Error('No price data available');
      }

      const pair = response.data.pairs[0];
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Generate sample data points for demonstration
      // In a production environment, you would fetch historical data from a proper API
      const priceData: PriceData[] = Array.from({ length: 100 }, (_, i) => {
        const basePrice = parseFloat(pair.priceUsd);
        const timeOffset = i * 3600; // 1 hour intervals
        const randomFactor = 0.98 + Math.random() * 0.04; // Random price variation ±2%
        
        return {
          timestamp: (currentTime - (100 - i) * 3600) * 1000,
          open: basePrice * randomFactor,
          high: basePrice * (randomFactor + 0.01),
          low: basePrice * (randomFactor - 0.01),
          close: basePrice * randomFactor,
          volume: pair.volume24h ? pair.volume24h * randomFactor : undefined
        };
      });

      if (chartRef.current && candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(priceData);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching price data:', err);
      setError('Failed to load price data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'rgba(18, 19, 31, 0.9)' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: 'rgba(70, 70, 70, 0.2)' },
        horzLines: { color: 'rgba(70, 70, 70, 0.2)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Store refs
    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Fetch initial data
    fetchPriceData();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-4 z-50 glass-effect rounded-xl overflow-hidden flex flex-col">
        <div className="window-header p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold">
              {tokenName ? `${tokenName} - PRICE CHART` : 'PRICE CHART'}
            </h2>
            <button
              onClick={fetchPriceData}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 bg-[#12131f]/90 relative">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          ) : loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : (
            <div ref={chartContainerRef} className="w-full h-full" />
          )}
        </div>
      </div>
    </>
  );
};

export default TokenChart;