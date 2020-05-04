import React, { Component } from 'react';
import Board from './board.js';
import Button from "react-bootstrap/Button";

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          xrow: null,
          ycol: null,
        },
      ],
      computer: false,
      stepNumber: 0,
      reverse: false,
      xIsNext: true,
      // (Math.floor((Math.random() * 2) + 1) === 1) ? false : true - If i want to try to randomize who starts
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return 0;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          ycol: i % 3,
          xrow: Math.floor(i / 3),
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

    return 1;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  generateLocation(move) {
    const history = this.state.history;
    const current = history[move];
    const loc = "(" + current.ycol + "," + current.xrow + ")";
    return loc;
  }

  reverseOrder() {
    this.setState({
      reverse: !this.state.reverse,
    });
  }

  squareCount(squares) {
    let count = 0;
    let i;
    for (i = 0; i < 9; i++) {
      if (squares[i]) {
        count += 1;
      }
    }
    return count;
  }

  gameReset() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          xrow: null,
          ycol: null,
        },
      ],
      computer: false,
      stepNumber: 0,
      reverse: false,
      xIsNext: true,
    });
  }

  gameResetAi() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          xrow: null,
          ycol: null,
        },
      ],
      computer: true,
      stepNumber: 0,
      reverse: false,
      xIsNext: true,
    });
  }

  basicOpponent() {
    let check = 0;
    while (!check) {
      const spot = Math.floor(Math.random() * 9);
      check = this.handleClick(spot);
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      let desc;
      const bold = move === this.state.stepNumber ? "bold" : "history";

      if (move === 0) {
        desc = "Go to game start";
        return (
          <li key={move}>
            <Button variant="outline-info" className={bold} onClick={() => this.jumpTo(move)}>
              {desc}
            </Button>
          </li>
        );
      }

      desc = move % 2 === 1
        ? "Move # " + move + ", Player One Move: " + this.generateLocation(move)
        : "Move # " + move + ", Player Two Move: " + this.generateLocation(move);

      return (
        <li key={move}>
          <Button variant="outline-info" className={bold} onClick={() => this.jumpTo(move)}>
            {desc}
          </Button>
        </li>
      );
    });

    if (this.state.reverse) {
      moves.sort(function (a, b) {
        return b.key - a.key;
      });
    }

    const winner = calculateWinner(current.squares);
    let status;
    let winnerlist;
    
    if (winner) {
      status = "Winner: " + winner[0];
      winnerlist = winner[1];
    } else if (this.squareCount(current.squares) === 9) {
      status = "No one won, its a tie";
      winnerlist = null;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      if (this.state.stepNumber % 2 === 1 && this.state.computer) {
        this.basicOpponent();
      }
      winnerlist = null;
    }

    const toggle = (<Button variant="secondary" size="lg" onClick={() => this.reverseOrder()} > Change Move Order </Button>);
    const resetHum = (<Button variant="secondary" size="lg" onClick={() => this.gameReset()}> New game with Human </Button>);
    const resetOpp = (< Button variant="secondary" size="lg" onClick={() => this.gameResetAi()}> New game with Computer </Button >);

    return (
      <div className="game">
        <div className="game-area">
          <div className="game-status">{status}</div>
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winner={winnerlist}/>
          <div className="game-reset">
            {resetHum} {resetOpp}
          </div>
        </div>
        <div className="game-moves">
          <div className="move-header">Game Moves</div>
          <nav>
            <ul className="moves">{moves}</ul>
          </nav>
          <div className="toggle">{toggle}</div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}