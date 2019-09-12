import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-1 shadow-sm">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://www.google.com"
          target="_blank"
          rel="noopener noreferrer">P2P energy Marketplace</a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white">
              Sua wallet: <span id="account">{ this.props.account }</span>
            </small>
          </li>
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white">
              Seu saldo: <span id="account-balance">{ this.props.accountBalance } ETK</span>
            </small>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
