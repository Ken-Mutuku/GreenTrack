const initBlockchain = require('../config/blockchain');

const getContract = async (req, res, next) => {
  try {
    const { contract } = await initBlockchain();
    res.json({ 
      contractAddress: contract.options.address,
      networkId: await contract.web3.eth.net.getId()
    });
  } catch (err) {
    next(err);
  }
};

const getProductFromBlockchain = async (req, res, next) => {
  try {
    const { contract } = await initBlockchain();
    const productId = req.params.id;
    
    const product = await contract.methods.getProduct(productId).call();
    const updateCount = await contract.methods.getUpdatesCount(productId).call();
    
    const updates = [];
    for (let i = 0; i < updateCount; i++) {
      const update = await contract.methods.getUpdate(productId, i).call();
      updates.push(update);
    }

    res.json({ ...product, updates });
  } catch (err) {
    next(err);
  }
};

module.exports = { getContract, getProductFromBlockchain };