import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2, XCircle, ExternalLink, Copy, Check } from 'lucide-react';
import axios from 'axios';
import DraggableWindow from './DraggableWindow';

interface RugCheckerProps {
  onClose: () => void;
}

interface Risk {
  name: string;
  value: string;
  description: string;
  score: number;
  level: string;
}

interface RugCheckResult {
  tokenType: string;
  risks: Risk[];
  tokenProgram?: string;
}

const RugChecker: React.FC<RugCheckerProps> = ({ onClose }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<RugCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);

  const handleCheck = async () => {
    if (!contractAddress) return;
    
    setIsChecking(true);
    setError(null);
    setResult(null);
    setTotalScore(0);

    try {
      const response = await axios.get(`https://api.rugcheck.xyz/v1/tokens/${contractAddress}/report/summary`);
      
      if (response.data && Array.isArray(response.data.risks)) {
        // Calculate total score from risk scores
        const score = response.data.risks.reduce((acc, risk) => acc + (risk.score || 0), 0);
        setTotalScore(score);
        setResult(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error checking token:', err);
      setError('Failed to analyze token. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <DraggableWindow
      title="RUG CHECKER"
      onClose={onClose}
      width="800px"
      defaultPosition={{ x: window.innerWidth - 832, y: 96 }}
    >
      <div className="p-6 space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
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
                    <div className="animate-spin h-4 w-4 border-2 border-purple-400 rounded-full border-t-transparent" />
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

        {/* Results Section */}
        {error ? (
          <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Rug Check Results */}
            {result && (
              <div className="space-y-4">
                {/* Overall Score */}
                <div className={`p-4 rounded-lg border ${totalScore >= 500 ? 'bg-green-400/20 border-green-400/30' : 'bg-red-400/20 border-red-400/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {totalScore >= 500 ? (
                        <CheckCircle2 className="text-green-400" size={24} />
                      ) : (
                        <XCircle className="text-red-400" size={24} />
                      )}
                      <div>
                        <h3 className={`font-semibold ${totalScore >= 500 ? 'text-green-400' : 'text-red-400'}`}>
                          {totalScore >= 500 ? 'GOOD' : 'RISKY'}
                        </h3>
                        <p className="text-white/60 text-sm">
                          Security Score: {totalScore}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {result.risks && result.risks.length > 0 && (
                  <div className="space-y-3">
                    {result.risks.map((risk, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          risk.level === 'danger' ? 'bg-red-400/20 border-red-400/30' :
                          risk.level === 'warn' ? 'bg-yellow-400/20 border-yellow-400/30' :
                          'bg-green-400/20 border-green-400/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {risk.level === 'danger' ? (
                            <XCircle className="text-red-400" size={24} />
                          ) : risk.level === 'warn' ? (
                            <AlertCircle className="text-yellow-400" size={24} />
                          ) : (
                            <CheckCircle2 className="text-green-400" size={24} />
                          )}
                          <div>
                            <h4 className={`font-semibold ${
                              risk.level === 'danger' ? 'text-red-400' :
                              risk.level === 'warn' ? 'text-yellow-400' :
                              'text-green-400'
                            }`}>
                              {risk.name}
                            </h4>
                            <p className="text-white/60 text-sm mt-1">
                              {risk.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="text-white/40 text-sm">
                                Value: {risk.value}
                              </p>
                              <p className="text-white/40 text-sm">
                                Score: {risk.score}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Token Program */}
                {result.tokenProgram && (
                  <div className="bg-[#12131f]/80 p-4 rounded-lg border border-white/5">
                    <h3 className="text-white font-semibold mb-2">Token Program</h3>
                    <p className="text-white/60 font-mono text-sm">{result.tokenProgram}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Default State */}
        {!result && !error && (
          <div className="bg-[#12131f]/50 p-4 rounded-lg">
            <p className="text-white/60 text-center">
              Enter a contract address to check for potential risks and security concerns.
            </p>
          </div>
        )}
      </div>
    </DraggableWindow>
  );
};

export default RugChecker;