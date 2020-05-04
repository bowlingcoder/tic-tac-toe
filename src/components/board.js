import React from 'react';
import Square from './square.js';

export default function Board(props) {
  return (
    <div className="game-board">
      {[0, 1, 2].map(x => (
        <div key={x} className="board-row">
          {[0, 1, 2].map(y => {
            const test = (props.winner && props.winner.includes((3 * x + y))) ? "winning-square" : "square"
            return (
              <Square
                key={3 * x + y}
                value={props.squares[3 * x + y]}
                flag={test}
                onClick={() => props.onClick(3 * x + y)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}