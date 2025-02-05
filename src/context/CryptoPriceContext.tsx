import React, { createContext, useContext, useState } from 'react';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
}

interface CryptoPriceContextType {
  prices: CryptoPrice[];
  updatePrices: (prices: CryptoPrice[]) => void;
}

const CryptoPriceContext = createContext<CryptoPriceContextType>({
  prices: [],
  updatePrices: () => {}
});

export const useCryptoPrices = () => useContext(CryptoPriceContext);

export const CryptoPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);

  const updatePrices = (newPrices: CryptoPrice[]) => {
    setPrices(newPrices);
  };

  return (
    <CryptoPriceContext.Provider value={{ prices, updatePrices }}>
      {children}
    </CryptoPriceContext.Provider>
  );
};