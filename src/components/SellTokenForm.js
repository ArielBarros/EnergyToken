import React, { Component } from 'react';

class SellTokenForm extends Component {
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
    this.props.sellTokens(amount);
  }

  render() {
    return (
      <div>
        <div className="card mb-5" >
          <h5 className="card-header text-center">Vender Tokens</h5>
          <div className="card-body">
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
              <button type="submit" className="btn btn-danger">Vender</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SellTokenForm;
