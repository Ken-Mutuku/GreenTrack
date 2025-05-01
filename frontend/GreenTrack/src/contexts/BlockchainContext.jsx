import React, { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import ProductTracking from '../contracts/ProductTracking.json';

const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initBlockchain = async () => {
      try {
        // Check if Web3 is injected (MetaMask)
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          // Get network ID
          const networkId = await web3Instance.eth.net.getId();
          
          // Get deployed contract instance
          const deployedNetwork = ProductTracking.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            ProductTracking.abi,
            deployedNetwork && deployedNetwork.address
          );

          setContract(contractInstance);
          setLoading(false);

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } else {
          console.error('Please install MetaMask!');
        }
      } catch (error) {
        console.error('Error initializing blockchain:', error);
        setLoading(false);
      }
    };

    initBlockchain();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return (
    <BlockchainContext.Provider value={{ account, contract, web3, loading }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => useContext(BlockchainContext);