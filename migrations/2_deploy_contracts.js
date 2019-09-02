const EnergyToken = artifacts.require("EnergyToken");
const EnergyTokenSale = artifacts.require("EnergyTokenSale");

module.exports = function(deployer) {
  const _name = "Energy Token";
  const _symbol = "ETK";
  const _decimals = 18;
  const _initialSupply = 1000000;
  const _tokenPrice = 1000000000000000; // Token price is 0.001 Ether

  deployer.deploy(EnergyToken, _name, _symbol, _decimals, _initialSupply, _tokenPrice);
};

// deployer.deploy(EnergyToken, _name, _symbol, _decimals, _initialSupply).then(() => {
//   const _tokenPrice = 1000000000000000; // Token price is 0.001 Ether
//   return deployer.deploy(EnergyTokenSale, EnergyToken.address, _tokenPrice);
// });
