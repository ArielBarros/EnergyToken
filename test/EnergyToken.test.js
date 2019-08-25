const EnergyToken = artifacts.require("EnergyToken");

require('chai').should();

contract('EnergyToken', accounts => {
  const _name = 'Energy Token';
  const _symbol = 'ETK';
  const _decimals = 18;
  const _initialSupply = 1000000;

  beforeEach( async () => {
    this.token = await EnergyToken.new(_name, _symbol, _decimals, _initialSupply);
  });

  describe('Token attributes', () => {
    it('has the correct name', async () => {
      const name = await this.token.name();
      name.should.equal(_name);
    });

    it('has the correct symbol', async () => {
      const symbol = await this.token.symbol();
      symbol.should.equal(_symbol);
    });

    //TODO: Decimals with big number
  });

});