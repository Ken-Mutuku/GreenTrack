// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductTracking {
    // Struct for product information
    struct Product {
        string productId;
        string farmerDetails;
        string initialData;
        uint256 timestamp;
    }

    // Struct for product updates
    struct Update {
        string location;
        string condition;
        string updatedBy;
        uint256 timestamp;
    }

    // Mapping to store products by ID
    mapping(string => Product) public products;
    
    // Mapping to store updates for each product
    mapping(string => Update[]) public productUpdates;

    // Events
    event ProductCreated(string productId);
    event ProductUpdated(string productId);

    // Create a new product
    function createProduct(
        string memory _productId,
        string memory _farmerDetails,
        string memory _initialData
    ) public {
        require(bytes(_productId).length > 0, "Product ID cannot be empty");
        require(bytes(products[_productId].productId).length == 0, "Product already exists");
        
        products[_productId] = Product({
            productId: _productId,
            farmerDetails: _farmerDetails,
            initialData: _initialData,
            timestamp: block.timestamp
        });
        
        emit ProductCreated(_productId);
    }

    // Update product information
    function updateProduct(
        string memory _productId,
        string memory _location,
        string memory _condition,
        string memory _updatedBy
    ) public {
        require(bytes(products[_productId].productId).length != 0, "Product does not exist");
        
        productUpdates[_productId].push(Update({
            location: _location,
            condition: _condition,
            updatedBy: _updatedBy,
            timestamp: block.timestamp
        }));
        
        emit ProductUpdated(_productId);
    }

    // Get product details
    function getProduct(string memory _productId) 
        public 
        view 
        returns (Product memory) 
    {
        return products[_productId];
    }

    // Get specific update for a product
    function getUpdate(string memory _productId, uint256 index) 
        public 
        view 
        returns (Update memory) 
    {
        return productUpdates[_productId][index];
    }

    // Get total updates count for a product
    function getUpdatesCount(string memory _productId) 
        public 
        view 
        returns (uint256) 
    {
        return productUpdates[_productId].length;
    }
}