const Marketplace = artifacts.require("Marketplace");

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Marketplace', ([deployer, seller, buyer]) => {
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

  describe('products', async () => {
    let result, productCount;
    const amount = 10;
    const price = web3.utils.toWei('1', 'Ether');
 
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
      let oldSellerBalance = await web3.eth.getBalance(seller);
      oldSellerBalance = new web3.utils.BN(oldSellerBalance);

      // Success
      result = await marketplace.buyProduct(productCount, { from: buyer, value: price });

      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
      assert.equal(event.amount.toNumber(), amount, 'amount is correct');
      assert.equal(event.price, price, 'price is correct');
      assert.equal(event.owner, buyer, 'owner is correct');
      assert.equal(event.purchased, true, 'purchased is correct');

      // Check that seller received funds
      let newSellerBalance = await web3.eth.getBalance(seller);
      newSellerBalance = new web3.utils.BN(newSellerBalance);

      bnPrice = new web3.utils.BN(price);
      const exepectedBalance = oldSellerBalance.add(bnPrice);
      assert.equal(newSellerBalance.toString(), exepectedBalance.toString(), 'balance is correct');

      // Failure: Tries to buy a product that does not exist, i.e., product must have valid id
      await marketplace.buyProduct(10000, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
      // Failure: Buyer tries to buy without enough ether
      await marketplace.buyProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
      // Failure: Deployer tries to buy the product, i.e., product can't be purchased twice
      await marketplace.buyProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
      // Failure: Buyer tries to buy again, i.e., buyer can't be the seller
      await marketplace.buyProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    });
  });
});