import React from 'react';
import { CryptoPriceProvider } from '../context/CryptoPriceContext';
import MainApp from '../components/MainApp';

const Dashboard = () => {
  return (
    <CryptoPriceProvider>
      <MainApp />
    </CryptoPriceProvider>
  );
};

export default Dashboard;