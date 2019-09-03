const EnergyToken = artifacts.require("EnergyToken");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('EnergyToken', ([deployer, seller, buyer]) => {
  const _name = 'Energy Token';
  const _symbol = 'ETK';
  const _decimals = 18;
  const _initialSupply = 1000000;
  const _tokenPrice = 1000000000000000;

  let energyToken;
  before( async () => {
    energyToken = await EnergyToken.deployed();
  });

  describe('Token attributes', () => {
    it('has the correct name', async () => {
      const name = await energyToken.name();
      name.should.equal(_name);
    });

    it('has the correct symbol', async () => {
      const symbol = await energyToken.symbol();
      symbol.should.equal(_symbol);
    });

    //TODO: Decimals with big number
  });

  describe('Buy tokens', () => {
    it('1 token selled for a buyer', async () => {
      // Success
      let oldBuyerBalance = await energyToken.balanceOf(buyer);
      await energyToken.buyTokens(1, { from: buyer, value: _tokenPrice });

      let newBuyerBalance = await energyToken.balanceOf(buyer);
      assert.equal(newBuyerBalance.toNumber(), oldBuyerBalance.toNumber() + 1, 'amount is correct');

      // Failure: Send not sufficient ether
      await energyToken.buyTokens(1, { from: buyer, value: _tokenPrice / 2 }).should.be.rejected;
    });
  });

});