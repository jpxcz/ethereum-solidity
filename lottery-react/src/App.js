import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: '',
    }
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({
      manager,
      players,
      balance,
    });

  }

  onSubmit = async event => {
    event.preventDefault();

    const { value } = this.state;
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });

    this.setState({ message: 'You have been entered!' });

  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    //const winner = await lottery.methods.getLastWinner().call();

    this.setState({ message: 'A winner has been picked! '/* + winner */});
  }

  render() {
    const { manager, players, balance, value, message } = this.state;

    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {manager}
          There are currently {players.length} people entered,
          competing to win {web3.utils.fromWei(balance, 'ether')} ether!
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={value}
              onChange={e => this.setState({ value: e.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />
        <h1>{message}</h1>


      </div>
    );
  }
}

export default App;
