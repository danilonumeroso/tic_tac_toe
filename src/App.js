import { useState } from 'react';
import { is_winner, is_draw, is_x_turn } from './logic'

function build_winning_message(squares) {
    if (is_winner(squares, 1)) {
        return "X wins!";
    } else if (is_winner(squares, -1)) {
        return "O wins!";
    } else if (is_draw(squares)) {
        return "Draw!";
    }
    return "";
}

function Square({ squareClass, onSquareClick, onMouseEnter, onMouseLeave }) {
  return (
    <div className={"cell " + squareClass}
      onClick={onSquareClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}/>
  );
}

function Board({ agent, isAgentTurn, setIsAgentTurn, xIsNext, squares, onHover, setSquares }) {

    function move(i) {
        if (squares[i] != 0) {
            return;
        }
        const nextSquares = [...squares];
        nextSquares[i] = xIsNext ? 1 : -1;
        setSquares(nextSquares);
        setIsAgentTurn(!isAgentTurn);
    }

    function getClassName(square) {
        if (square == 0) {
            return ""
        }
        return square > 0 ? "x" : "circle"
    }

    if (isAgentTurn) {
        move(agent.get(JSON.stringify(squares)));
    }

    return (
        <>
        {squares.map((square, idx) => (
            <Square
                key={idx}
                squareClass={getClassName(square)}
                onSquareClick={() => move(idx)}
                onMouseEnter={() => onHover(xIsNext ? 'x' : 'circle')}
                onMouseLeave={() => onHover('')}
            />
        ))}
        </>
    );
}

export default function Game({agent}) {
    const [squares, setSquares] = useState(Array(9).fill(0));
    const [isAgentTurn, setIsAgentTurn] = useState(Math.random() > 0.5);
    const [hoverClass, setHoverClass] = useState('');
    const xIsNext = is_x_turn(squares);
    const message = build_winning_message(squares);

    return (
        <>
          <div className={"board " + hoverClass}>
            <Board
                agent={agent}
                isAgentTurn={isAgentTurn}
                setIsAgentTurn={setIsAgentTurn}
                xIsNext={xIsNext}
                squares={squares}
                onHover={setHoverClass}
                setSquares={setSquares} />
          </div>
          <div className={"winning-message " + (message.length > 0 ? "show" : "")}>
            <div>{message}</div>
            <button onClick={() => {
                setSquares(Array(9).fill(0));
                setIsAgentTurn(Math.random() > 0.5);
            }}>{"Restart"}</button>
          </div>
        </>
    );
}
