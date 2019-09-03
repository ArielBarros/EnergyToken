const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  const _name = 'P2P trading energy marketplace';
  const _symbol = 'ETK';
  const _decimals = 18;
  const _initialSupply = 1000000;
  const _tokenPrice = 1000000000000000; // Token price is 0.001 Ether

  deployer.deploy(Marketplace, _name, _symbol, _decimals, _initialSupply, _tokenPrice);
};
