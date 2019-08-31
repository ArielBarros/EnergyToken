pragma solidity ^0.5.0;

contract Marketplace {
  string public name;
  uint public productCount = 0;
  mapping(uint => Product) public products;

  struct Product {
    uint id;
    uint amount;
    uint price;
    address payable owner;
    bool purchased;
  }

  event ProductCreated(
    uint id,
    uint amount,
    uint price,
    address payable owner,
    bool purchased
  );

  event ProductPurchased(
    uint id,
    uint amount,
    uint price,
    address payable owner,
    bool purchased
  );

  constructor() public {
    name = "P2P trading energy marketplace";
  }

  function createProduct(uint _amount, uint _price) public {
    require(_amount > 0, 'amount needs to be positive');
    require(_price > 0, 'price needs to be positive');

    productCount ++;
    products[productCount] = Product(productCount, _amount, _price, msg.sender, false);

    emit ProductCreated(productCount, _amount, _price, msg.sender, false);
  }

  function buyProduct(uint _id) public payable {
    Product memory _product = products[_id]; // fetch product on blokchain to a copy memory variable
    address payable _seller = _product.owner;

    require(_product.id > 0 && _product.id <= productCount, '');
    require(msg.value >= _product.price, '');
    require(!_product.purchased, '');
    require(_seller != msg.sender, '');

    _product.owner = msg.sender;
    _product.purchased = true;
    products[_id] = _product; // Update the product on blockchain
    address(_seller).transfer(msg.value);

    emit ProductPurchased(productCount, _product.amount, _product.price, _product.owner, _product.purchased);
  }
}
