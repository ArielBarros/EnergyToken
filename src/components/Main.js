import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content" className="container">
        <h1>Vender Energia</h1>
        <form onSubmit={ event => {
          event.preventDefault();
          const amount = this.productAmount.value;
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether');
          this.props.createProduct(amount, price);
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productAmount"
              type="text"
              ref={ input => { this.productAmount = input }}
              className="form-control"
              placeholder="Quantidade de kWh"
              autoComplete="off"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={ input => { this.productPrice = input }}
              className="form-control"
              placeholder="Preço do kWh"
              autoComplete="off"
              required />
          </div>
          <button type="submit" className="btn btn-success">Vender energia</button>
        </form>
        <p>&nbsp;</p>
        <h2>Comprar Energia</h2>
        { this.props.products.map((product, key) => 
          <div className="card mb-5" key={ key }>
            <h5 className="card-header">#{ product.id.toString() } | Vendedor: { product.owner.toString() } </h5>
            <div className="card-body">
              <h5 className="card-title">Quantidade: { product.amount.toString() } kWh</h5>
              <p className="card-text">Preço: { window.web3.utils.fromWei(product.price.toString(), 'Ether') } ETH</p>
              <button
                className="btn btn-primary" 
                name={ product.id }         
                value={ product.price }
                onClick={ event => {
                  this.props.buyProduct(event.target.name, event.target.value);
                }}>Comprar</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Main;
