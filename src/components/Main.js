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
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={ input => { this.productPrice = input }}
              className="form-control"
              placeholder="Preço do kWh"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Vender energia</button>
        </form>
        <p>&nbsp;</p>
        <h2>Comprar Energia</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Quantidade</th>
              <th scope="col">Preço</th>
              <th scope="col">Vendedor</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
