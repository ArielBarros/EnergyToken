require('dotenv').config();
const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer, network, accounts) {
  const _name = 'P2P trading energy marketplace';
  const _symbol = 'ETK';
  const _decimals = 18;
  const _initialSupply = 1000000;
  const _tokenPrice = 1000000000000000; // Token price is 0.001 Ether

  let _utilityCompany;
  if (network == 'ropsten') {
    _utilityCompany = process.env.UTILITY_COMPANY_ACCOUNT;
  } else {
    _utilityCompany = accounts[3];
  }

  deployer.deploy(Marketplace, _name, _symbol, _decimals, _initialSupply, _tokenPrice, _utilityCompany);
};
