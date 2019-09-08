import React, { Component } from 'react';

class TokenForm extends Component {
  constructor(props) {
    super(props);
    this.state = { tokensAmount: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ tokensAmount: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const amount = this.state.tokensAmount;
    this.props.buyTokens(amount);
  }

  render() {
    return (
      <div id="content">
        <p> Your balance is: { this.props.accountBalance } ETK</p>
        <h1>Comprar Tokens</h1>
        <form onSubmit={ this.handleSubmit }>
          <div className="form-group mr-sm-2">
            <input
              id="tokensAmount"
              type="text"
              value={ this.state.tokensAmount }
              className="form-control"
              placeholder="Quantidade de Tokens"
              onChange={ this.handleChange }
              autoComplete="off"
              required />
          </div>
          <button type="submit" className="btn btn-success">Comprar tokens</button>
        </form>
      </div>
    );
  }
}

export default TokenForm;
