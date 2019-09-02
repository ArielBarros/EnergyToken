pragma solidity ^0.5.0;

import '../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import '../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';

contract EnergyToken is ERC20, ERC20Detailed {
  address public owner;
  uint256 public tokenPrice;

  event Sell(address _buyer, uint256 _amount);

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

  function buyTokens(uint256 _numberOfTokens) public payable {
    require(msg.value == _numberOfTokens.mul(tokenPrice), "Not suficient ether");
    // require(balanceOf(address(this)) >= _numberOfTokens, "Not suficient tokens");
    _mint(msg.sender, _numberOfTokens);

    emit Sell(msg.sender, _numberOfTokens);
  }
}
