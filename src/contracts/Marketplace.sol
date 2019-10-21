pragma solidity ^0.5.0;

import '../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import '../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';

contract Marketplace is ERC20, ERC20Detailed {
  uint public productCount = 0;
  uint256 public tokenPrice;
  address public owner;

  mapping(uint => Product) public products;

  event Buy(address _buyer, uint256 _amount);
  event Sell(address _seller, uint256 _amount);

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
    address payable seller,
    address payable owner,
    bool purchased
  );

  constructor (
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint256 _initialSupply,
    uint256 _tokenPrice
  ) ERC20Detailed(_name, _symbol, _decimals) public {
    owner = msg.sender;
    tokenPrice = _tokenPrice;
    _mint(owner, _initialSupply);
  }

  function createProduct(uint _amount, uint _price) public {
    require(_amount > 0, 'amount needs to be positive');
    require(_price > 0, 'price needs to be positive');

    productCount ++;
    products[productCount] = Product(productCount, _amount, _price, msg.sender, false);

    emit ProductCreated(productCount, _amount, _price, msg.sender, false);
  }

  function buyProduct(uint _id, uint value) public payable {
    Product memory _product = products[_id];
    address payable _seller = _product.owner;

    require(_product.id > 0 && _product.id <= productCount, '');
    require(value >= _product.price, '');
    require(!_product.purchased, '');
    require(_seller != msg.sender, '');

    _product.owner = msg.sender;
    _product.purchased = true;
    products[_id] = _product;
    transfer(_seller, value);

    emit ProductPurchased(_product.id, _product.amount, _product.price, _seller, _product.owner, _product.purchased);
  }

  function buyTokens(uint256 _numberOfTokens) public payable {
    require(msg.value == _numberOfTokens.mul(tokenPrice), "Not suficient ether");
    _mint(msg.sender, _numberOfTokens);

    emit Buy(msg.sender, _numberOfTokens);
  }

  function sellTokens(uint256 _numberOfTokens) public payable {
    address payable _seller = msg.sender;
    uint etherValue = _numberOfTokens.mul(tokenPrice);
    address(_seller).transfer(etherValue);
    _burn(_seller, _numberOfTokens);

    emit Sell(_seller, _numberOfTokens);
  }
}
