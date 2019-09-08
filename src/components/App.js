import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Marketplace from '../abis/Marketplace.json';
import Navbar from './Navbar';
import Main from './Main';
import TokenForm from './TokenForm';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];

    if(networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address);
      this.setState({ marketplace });

      const accountBalance = await marketplace.methods.balanceOf(this.state.account).call();
      this.setState({ accountBalance: accountBalance.toNumber() });

      const productCount = await marketplace.methods.productCount().call();
      this.setState({ productCount });

      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        this.setState({ products: [...this.state.products, product] });
      }

      this.setState({ loading: false });
    } else {
      window.alert('Marketplace contract not deployed to that network.')
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      productCount: 0,
      accountBalance: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this);
    this.buyProduct = this.buyProduct.bind(this);
    this.buyTokens = this.buyTokens.bind(this);
  }

  createProduct(amount, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods.createProduct(amount, price).send({ from: this.state.account })
    .once('receipt', receipt => {
      this.setState({ loading: false });
    });
  }

  buyProduct(id, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods.buyProduct(id, price).send({ from: this.state.account })
    .once('receipt', receipt => {
      this.setState({ loading: false });
    });
  }

  buyTokens(amount) {
    this.setState({ loading: true });
    // const tokenPrice = web3.utils.toWei('0.001', 'Ether');
    const tokenPrice = 1000000000000000;
    this.state.marketplace.methods.buyTokens(amount).send({ from: this.state.account, value: amount * tokenPrice })
    .once('receipt', receipt => {
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <div>
        <Navbar account={ this.state.account } />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center">
                    <p className="text-center">Carregando dados da blockchain...</p>
                  </div>
                : <div id="content" className="container">
                    <TokenForm 
                      accountBalance={ this.state.accountBalance }
                      buyTokens={ this.buyTokens } 
                    />
                    <Main 
                      products={ this.state.products }
                      createProduct={ this.createProduct }
                      buyProduct={ this.buyProduct } 
                    />
                  </div>
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
