import React from "react";
import { formatEther } from "ethers";
import '../styles/OwnedItems.css';

const OwnedItems = ({ ownedItems }) => {
  return (
    <div className="owned-items">
      <h2>Your Items</h2>
      {ownedItems.length === 0 ? (
        <p>You don't own any items yet.</p>
      ) : (
        ownedItems.map((item) => (
          <div key={item.id.toString()} className="item-card">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Price:</strong> {formatEther(item.price)} ETH</p>
            <p><strong>Owner:</strong> {item.owner}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OwnedItems;
