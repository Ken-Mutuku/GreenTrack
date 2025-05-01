// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Marketplace {
    struct Item {
        uint id;
        string name;
        uint price;
        address payable seller;
        address owner;
        bool isSold;
        string harvestDate;
        string location;
        string farmId;
        bool organic;
    }

    uint public itemCount = 0;
    mapping(uint => Item) public items;
    mapping(address => uint[]) public ownedItems;

    event ItemListed(
        uint id,
        string name,
        uint price,
        address seller,
        string harvestDate,
        string location,
        string farmId,
        bool organic
    );

    function listItem(
        string memory _name,
        uint _price,
        string memory _harvestDate,
        string memory _location,
        string memory _farmId,
        bool _organic
    ) public {
        require(_price > 0, "Price must be greater than zero");

        itemCount++;
        items[itemCount] = Item(
            itemCount,
            _name,
            _price,
            payable(msg.sender),
            msg.sender,
            false,
            _harvestDate,
            _location,
            _farmId,
            _organic
        );
        ownedItems[msg.sender].push(itemCount);

        emit ItemListed(
            itemCount,
            _name,
            _price,
            msg.sender,
            _harvestDate,
            _location,
            _farmId,
            _organic
        );
    }

    function purchaseItem(uint _id) public payable {
        Item storage item = items[_id];
        require(_id > 0 && _id <= itemCount, "Item does not exist");
        require(msg.value == item.price, "Incorrect price");
        require(!item.isSold, "Item already sold");
        require(msg.sender != item.seller, "Seller cannot buy their own item");

        item.isSold = true;
        item.seller.transfer(msg.value);

        _transferOwnership(_id, item.seller, msg.sender);
    }

    function _transferOwnership(uint _id, address _from, address _to) internal {
        Item storage item = items[_id];
        item.owner = _to;

        uint[] storage fromItems = ownedItems[_from];
        for (uint i = 0; i < fromItems.length; i++) {
            if (fromItems[i] == _id) {
                fromItems[i] = fromItems[fromItems.length - 1];
                fromItems.pop();
                break;
            }
        }

        ownedItems[_to].push(_id);
    }

    function transferItem(uint _id, address _to) public {
        Item storage item = items[_id];
        require(_id > 0 && _id <= itemCount, "Item does not exist");
        require(msg.sender == item.owner, "You do not own this item");

        _transferOwnership(_id, msg.sender, _to);
    }

    function getItemsByOwner(address _owner) public view returns (uint[] memory) {
        return ownedItems[_owner];
    }
}