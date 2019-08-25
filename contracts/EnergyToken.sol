pragma solidity ^0.5.0;

import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';

contract EnergyToken is ERC20, ERC20Detailed {
  constructor (
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint256 _initialSupply
  ) ERC20Detailed(_name, _symbol, _decimals) public {
    _mint(msg.sender, _initialSupply);
  }

  function buyEnergy(address provider, uint256 amount) public {
    // Safe guards here
    // transfer for utility company
    // transfer for provider
  }
}
