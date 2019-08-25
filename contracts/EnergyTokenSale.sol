pragma solidity ^0.5.0;

import './EnergyToken.sol';
import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract EnergyTokenSale {
  using SafeMath for uint256;
  EnergyToken public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokensSold;

  event Sell(address _buyer, uint256 _amount);

  constructor(EnergyToken _tokenContract, uint256 _tokenPrice) public {
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }

  function buyTokens(uint256 _numberOfTokens) public payable {
    require(msg.value == _numberOfTokens.mul(tokenPrice), "Not suficient ether");
    require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "Not suficient tokens");
    require(tokenContract.transfer(msg.sender, _numberOfTokens), "Error in transaction");

    tokensSold += _numberOfTokens;

    emit Sell(msg.sender, _numberOfTokens);
  }
}
