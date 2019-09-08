import React, { Component } from 'react';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      productAmount: '',
      productPrice: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ ...this.state, [event.target.name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const amount = this.state.productAmount;
    const price = this.state.productPrice.toString();
    this.props.createProduct(amount, price);
  }

  render() {
    return (
      <div>
        <h1>Vender Energia</h1>
        <form onSubmit={ this.handleSubmit }>
          <div className="form-group mr-sm-2">
            <input
              id="productAmount"
              name="productAmount"
              type="text"
              value={ this.state.productAmount }
              onChange={ this.handleChange }
              className="form-control"
              placeholder="Quantidade de kWh"
              autoComplete="off"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              name="productPrice"
              type="text"
              value={ this.state.productPrice }
              onChange={ this.handleChange }
              className="form-control"
              placeholder="Preço em ETK do kWh"
              autoComplete="off"
              required />
          </div>
          <button type="submit" className="btn btn-success">Vender energia</button>
        </form>
        <p>&nbsp;</p>
        <h2>Comprar Energia</h2>
        { this.props.products.map((product, key) =>
          !product.purchased ?
          <div className="card mb-5" key={ key }>
            <h5 className="card-header">#{ product.id.toString() } | Vendedor: { product.owner.toString() } </h5>
            <div className="card-body">
              <h5 className="card-title">Quantidade: { product.amount.toString() } kWh</h5>
              <p className="card-text">Preço: { product.price.toString() } ETK</p>
              <button
                className="btn btn-primary" 
                name={ product.id }         
                value={ product.price }
                onClick={ event => {
                  this.props.buyProduct(event.target.name, event.target.value);
                }}>Comprar</button>
            </div>
          </div>
          : null
        )}
      </div>
    );
  }
}

export default Main;
