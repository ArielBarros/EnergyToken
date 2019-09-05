import React, { Component } from 'react';

class TokenForm extends Component {
  render() {
    return (
      <div id="content">
        <p> Your balance is: { this.props.accountBalance } ETK</p>
        <h1>Comprar Tokens</h1>
        <form onSubmit={ event => {
          event.preventDefault();
          const amount = this.tokensAmount.value;
          this.props.buyTokens(amount);
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="tokensAmount"
              type="text"
              ref={ input => { this.tokensAmount = input }}
              className="form-control"
              placeholder="Quantidade de Tokens"
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
