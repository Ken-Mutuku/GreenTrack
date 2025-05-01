const Web3 = require('web3');

// Set up Web3 provider (use Infura for test networks or your local node URL)
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'));

// Smart contract ABI and address
const contractABI = require('./path-to-ABI.json'); // Path to your ABI JSON file
const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE'; // Contract address after deployment

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Example: Call a function from the smart contract
async function getProductDetails(productId) {
    try {
        const productDetails = await contract.methods.getProductDetails(productId).call();
        console.log('Product Details:', productDetails);
        return productDetails;
    } catch (error) {
        console.error('Error interacting with the contract:', error);
    }
}

// Example: Interact with the contract and get details for product ID 1
getProductDetails(1);
