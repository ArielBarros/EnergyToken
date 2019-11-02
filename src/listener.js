const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));
const Marketplace = require('./abis/Marketplace.json');

eventListener = async () => {
  const networkId = await web3.eth.net.getId();
  const networkData = Marketplace.networks[networkId];
  const marketplace = await web3.eth.Contract(Marketplace.abi, networkData.address);
  
  console.log('Listening events...');
  marketplace.events.Buy().on('data', event => {
    console.log(event);
  });

  marketplace.events.ProductPurchased().on('data', event => {
    console.log(event);
  });
}

eventListener();
