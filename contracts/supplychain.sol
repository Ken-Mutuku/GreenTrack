// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Product {
        uint id;
        string name;
        string quality;
        address currentOwner;
        uint timestamp;
    }

    mapping(uint => Product) public products;
    uint public productCount;

    function addProduct(string memory _name, string memory _quality) public {
        productCount++;
        products[productCount] = Product(productCount, _name, _quality, msg.sender, block.timestamp);
    }

    function getProduct(uint _id) public view returns (string memory, string memory, address, uint) {
        Product memory p = products[_id];
        return (p.name, p.quality, p.currentOwner, p.timestamp);
    }
}
