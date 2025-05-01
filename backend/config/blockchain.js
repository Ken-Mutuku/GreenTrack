const Web3 = require('web3');
const ProductTracking = require('../contracts/ProductTracking.json');

const initBlockchain = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ProductTracking.networks[networkId];
      const contract = new web3.eth.Contract(
        ProductTracking.abi,
        deployedNetwork && deployedNetwork.address
      );
      return { web3, contract };
    } catch (error) {
      console.error('Error initializing blockchain:', error);
      throw error;
    }
  } else {
    const provider = new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_PROVIDER);
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(
      ProductTracking.abi,
      process.env.CONTRACT_ADDRESS
    );
    return { web3, contract };
  }
};

module.exports = initBlockchain;