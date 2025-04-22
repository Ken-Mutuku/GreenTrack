import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserProvider, Contract, parseEther } from "ethers";
import "./App.css";

import Items from "./pages/Items.jsx";
import OwnedItems from "./pages/OwnedItems.jsx";
import ItemForSale from "./pages/ItemForSale.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Track from "./pages/Track.jsx";

function App() {
  const CONTRACT_ADDRESS = "0xf3777503bdffef11ac76c118e79f652cf20eafc3";
  const ABI =[
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "listItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "purchaseItem",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "transferItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "getItemsByOwner",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "itemCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "items",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "seller",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isSold",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ownedItems",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [items, setItems] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);

        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setIsConnected(true);

        const signer = await provider.getSigner();
        setSigner(signer);

        const contractInstance = new Contract(CONTRACT_ADDRESS, ABI, signer);
        setContract(contractInstance);

        loadItems(contractInstance);
        loadOwnedItems(contractInstance, accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const purchaseItem = async (itemId) => {
    if (!contract || !account) return console.error("Contract or account not initialized");

    try {
      const item = await contract.items(itemId);

      if (itemId <= 0 || itemId > (await contract.itemCount())) {
        throw new Error("Item does not exist");
      }
      if (item.isSold) throw new Error("Item already sold");
      if (item.seller.toLowerCase() === account.toLowerCase()) {
        throw new Error("You can't buy your own item");
      }

      const tx = await contract.purchaseItem(itemId, {
        value: item.price,
        gasLimit: 300000,
      });

      await tx.wait();
      loadItems(contract);
      loadOwnedItems(contract, account);
    } catch (error) {
      console.error("Purchase failed:", error);
      let userMessage = "Purchase failed";
      if (error.message.includes("Item does not exist")) userMessage = "Item doesn't exist";
      else if (error.message.includes("Item already sold")) userMessage = "Item already sold";
      else if (error.message.includes("own item")) userMessage = "You can't buy your own listing";
      else if (error.message.includes("Incorrect price")) userMessage = "Please send the exact price";
      alert(userMessage);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) connectWallet();
      }
    };
    checkConnection();
  }, []);

  const loadItems = async (contract) => {
    if (!contract) return;
    try {
      const itemCount = await contract.itemCount();
      const items = [];
      for (let i = 1; i <= itemCount; i++) {
        const item = await contract.items(i);
        items.push(item);
      }
      setItems(items);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  const loadOwnedItems = async (contract, owner) => {
    if (!contract || !owner) return;
    try {
      const ownedItemIds = await contract.getItemsByOwner(owner);
      const ownedItems = [];
      for (let i = 0; i < ownedItemIds.length; i++) {
        const item = await contract.items(ownedItemIds[i]);
        ownedItems.push(item);
      }
      setOwnedItems(ownedItems);
    } catch (error) {
      console.error("Error loading owned items:", error);
    }
  };

  const listItem = async (name, price) => {
    if (!contract) return console.error("Contract is not initialized");
    if (!name || !price) return console.error("Please enter a valid name and price");

    try {
      const tx = await contract.listItem(name, parseEther(price));
      await tx.wait();
      loadItems(contract);
    } catch (error) {
      console.error("Error listing item:", error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar account={account} isConnected={isConnected} connectWallet={connectWallet} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<ItemForSale items={items} account={account} purchaseItem={purchaseItem} />} />
          <Route path="/list" element={<Items contract={contract} listItem={listItem} />} />
          <Route path="/myitems" element={<OwnedItems ownedItems={ownedItems} />} />
          <Route path= "/track" element={ <Track/> }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
