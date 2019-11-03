const Marketplace = artifacts.require("Marketplace");

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Marketplace', ([deployer, seller, buyer, utilityCompany]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a name', async () => {
      const name = await marketplace.name();
      assert.equal(name, 'P2P trading energy marketplace');
    });
  });

  describe('Trade tokens', async () => {
    const _tokenPrice = web3.utils.toWei('0.001', 'Ether'); // 1000000000000000
    const _numberOfTokens = 2;

    it('1 token buyed by the buyer', async () => {
      // Success
      let oldBuyerBalance = await marketplace.balanceOf(buyer);
      await marketplace.buyTokens(_numberOfTokens, { from: buyer, value: _numberOfTokens * _tokenPrice });

      let newBuyerBalance = await marketplace.balanceOf(buyer);
      assert.equal(newBuyerBalance.toNumber(), oldBuyerBalance.toNumber() + _numberOfTokens, 'amount is correct');

      // Failure: Send not sufficient ether
      await marketplace.buyTokens(_numberOfTokens, { from: buyer, value: _numberOfTokens * _tokenPrice / 2 }).should.be.rejected;
    });

    it('1 token selled by the buyer', async () => {
      // Success
      let oldBuyerBalance = await web3.eth.getBalance(buyer);
      oldBuyerBalance = new web3.utils.BN(oldBuyerBalance);

      await marketplace.sellTokens(_numberOfTokens, { from: buyer });

      let newBuyerBalance = await web3.eth.getBalance(buyer);
      newBuyerBalance = new web3.utils.BN(newBuyerBalance);

      let _totalGasPriceUsed = web3.utils.toWei('0.00057456', 'Ether'); // 574560000000000
      _totalGasPriceUsed = new web3.utils.BN(_totalGasPriceUsed); 
      const _tokenPriceBN = new web3.utils.BN(_tokenPrice);
      const expectedBalance = oldBuyerBalance.add(_tokenPriceBN.mul(new web3.utils.BN(_numberOfTokens))).sub(_totalGasPriceUsed);

      assert.equal(newBuyerBalance.toString(), expectedBalance.toString(), 'amount is correct');
    });
  });

  describe('products', async () => {
    let result, productCount;
    const amount = 10;
    const price = 4; // ETK
    const utilityFee = 0.25 // 25% of product price

    before(async () => {
      result = await marketplace.createProduct(amount, price, { from: seller });
      productCount = await marketplace.productCount();
    });

    it('creates products', async () => {
      // Success
      assert.equal(productCount, 1);
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
      assert.equal(event.amount.toNumber(), amount, 'amount is correct');
      assert.equal(event.price, price, 'price is correct');
      assert.equal(event.owner, seller, 'owner is correct');
      assert.equal(event.purchased, false, 'purchased is correct');
      
      // Failure: Product must have a amount
      await marketplace.createProduct(0, price, { from: seller }).should.be.rejected;
      // Failure: Product must have a price
      await marketplace.createProduct(amount, 0, { from: seller }).should.be.rejected;
    });

    it('lists products', async () => {
      const product = await marketplace.products(productCount)
      assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct');
      assert.equal(product.amount, amount, 'amount is correct');
      assert.equal(product.price, price, 'price is correct');
      assert.equal(product.owner, seller, 'owner is correct');
      assert.equal(product.purchased, false, 'purchased is correct');
    });

    it('sells products', async () => {
      // Success
      let oldSellerBalance = await marketplace.balanceOf(seller);
      let oldUtilityCompanyBalance = await marketplace.balanceOf(utilityCompany);

      await marketplace.buyTokens(price, { from: buyer, value: web3.utils.toWei(('0.001' * price).toString(), 'Ether') });
      await marketplace.buyProduct(productCount, price, { from: buyer });

      // Check if seller received funds
      let newSellerBalance = await marketplace.balanceOf(seller);
      assert.equal(newSellerBalance.toNumber(), oldSellerBalance.toNumber() + price * (1 - utilityFee), 'balance is correct');

      // Check if utility company received the fee
      let newUtilityCompanyBalance = await marketplace.balanceOf(utilityCompany);
      assert.equal(newUtilityCompanyBalance.toNumber(), oldUtilityCompanyBalance.toNumber() + price * utilityFee, 'balance is correct');

      // Failure: Tries to buy a product that does not exist, i.e., product must have valid id
      await marketplace.buyProduct(10000, price, { from: buyer }).should.be.rejected;
      // Failure: Buyer tries to buy without enough tokens
      await marketplace.buyProduct(productCount, price - 1, { from: buyer }).should.be.rejected;
      // Failure: Deployer tries to buy the product, i.e., product can't be purchased twice
      await marketplace.buyProduct(productCount, price, { from: deployer }).should.be.rejected;
      // Failure: Buyer tries to buy again, i.e., buyer can't be the seller
      await marketplace.buyProduct(productCount, price, { from: buyer }).should.be.rejected;
    });
  });
});