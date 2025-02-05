import React from 'react';

interface Holder {
  address: string;
  amount: string;
  percentage: number;
}

interface BundleVisualizationProps {
  holders: Holder[];
  totalBundles?: number;
  solSpent?: number;
  bundledTotal?: number;
  heldPercentage?: number;
  heldTokens?: string;
}

const BundleVisualization: React.FC<BundleVisualizationProps> = ({
  holders,
  totalBundles,
  solSpent,
  bundledTotal,
  heldPercentage,
  heldTokens
}) => {
  // Calculate the total percentage to determine circle sizes
  const totalPercentage = holders.reduce((acc, holder) => acc + holder.percentage, 0);
  
  // Calculate relative sizes for visualization
  const getSize = (percentage: number) => {
    const baseSize = 200; // Base size for the largest circle
    return Math.max(40, (percentage / Math.max(...holders.map(h => h.percentage))) * baseSize);
  };

  return (
    <div className="bg-[#12131f]/80 p-6 rounded-lg border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold">Bundle Distribution</h3>
        <div className="flex items-center gap-4">
          {totalBundles && (
            <div className="text-white/60 text-sm">
              Total Bundles: <span className="text-white">{totalBundles}</span>
            </div>
          )}
          {solSpent && (
            <div className="text-white/60 text-sm">
              SOL Spent: <span className="text-white">◎{solSpent.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Visualization Container */}
      <div className="relative h-[400px] flex items-center justify-center mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          {holders.map((holder, index) => {
            const size = getSize(holder.percentage);
            // Calculate position to create a circular arrangement
            const angle = (2 * Math.PI * index) / holders.length;
            const radius = 120; // Radius of the arrangement circle
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={holder.address}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-full border border-red-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
              >
                <div className="text-center">
                  <div className="text-white font-bold">{holder.percentage.toFixed(2)}%</div>
                  <div className="text-white/60 text-xs truncate max-w-[120px] px-2">
                    {holder.address.slice(0, 4)}...{holder.address.slice(-4)}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {holder.amount}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {bundledTotal && (
          <div className="bg-[#1a1b2e] p-3 rounded-lg">
            <div className="text-white/60 text-sm">Bundled Total</div>
            <div className="text-white font-semibold">{bundledTotal.toFixed(2)}%</div>
          </div>
        )}
        {heldPercentage && (
          <div className="bg-[#1a1b2e] p-3 rounded-lg">
            <div className="text-white/60 text-sm">Held Percentage</div>
            <div className="text-white font-semibold">{heldPercentage.toFixed(2)}%</div>
          </div>
        )}
        {heldTokens && (
          <div className="bg-[#1a1b2e] p-3 rounded-lg">
            <div className="text-white/60 text-sm">Held Tokens</div>
            <div className="text-white font-semibold">{heldTokens}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BundleVisualization;