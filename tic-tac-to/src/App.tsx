import { useState } from "react";
import "./App.css";

function Square(props: { value: string; handleValue: () => void }) {
  return (
    <div className="square" onClick={props.handleValue}>
      {props.value}
    </div>
  );
}

function Board(props: {
  squares: any[];
  size: number;
  isXNext: boolean;
  onPlay: (newSquares: any) => void;
}) {
  const handleClick = (i: number) => {
    const newSquares = [...props.squares];

    if (winner) {
      console.log("이미 승리자가 있습니다.");
      return;
    }

    if (newSquares[i]) {
      console.log("이미 선택된 칸입니다.");
      return;
    }

    newSquares[i] = props.isXNext ? "X" : "O";
    props.onPlay(newSquares);
  };
  const winner: string | null = calculateWinner(props.squares, props.size);

  const renderRow = Array(props.size)
    .fill(null)
    .map((_, i) => {
      const renderCollumn = Array(props.size)
        .fill(null)
        .map((_, j) => {
          return (
            <Square
              key={i * props.size + j}
              value={props.squares[i * props.size + j]}
              handleValue={() => handleClick(i * props.size + j)}
            />
          );
        });

      return (
        <div className="board-row" key={i}>
          {renderCollumn}
        </div>
      );
    });

  return (
    <>
      <div className="info">
        {winner
          ? `Winner is: ${winner}`
          : `Next Player is: ${props.isXNext ? "X" : "O"}`}
      </div>
      {renderRow}
    </>
  );
}

function App() {
  const [boardSize, setBoardSize] = useState(3);
  const [squares, setSquares] = useState(Array(boardSize * boardSize).fill(""));
  const [isXNext, setIsXNext] = useState(true);

  let newSize: number;

  const handleBoarder = () => {
    setBoardSize(() => {
      return newSize;
    });
    setSquares(() => Array(newSize * newSize).fill(""));
  };

  const handlePlay = (newSquares: any) => {
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };
  return (
    <>
      <div className="boarder-size">
        <input
          type="number"
          onChange={(event) => {
            newSize = parseInt((event.target as HTMLInputElement).value);
          }}
        />
        <button
          onClick={() => {
            handleBoarder();
          }}
        >
          적용
        </button>
      </div>
      <Board
        squares={squares}
        size={boardSize}
        isXNext={isXNext}
        onPlay={handlePlay}
      />
    </>
  );
}

function calculateWinner(squares: string[], size: number): string | null {
  const lines = Array(squares.length)
    .fill(null)
    .map((_, i) => {
      return i;
    });

  let winner = null;

  const row = Array(size)
    .fill([])
    .map((_, i) => {
      return lines.slice(i * size, i * size + size);
    });

  row.forEach((rowEl) => {
    if (
      rowEl.every(
        (value) => !!squares[rowEl[0]] && squares[value] === squares[rowEl[0]]
      )
    ) {
      if (squares[rowEl[0]] === "X") {
        winner = "X";
      } else {
        winner = "O";
      }
    }
  });

  const col = Array(size)
    .fill([])
    .map((_, i) => {
      return lines.filter((_, j) => {
        return j % size === i;
      });
    });

  col.forEach((colEl) => {
    if (
      colEl.every(
        (value) => !!squares[colEl[0]] && squares[value] === squares[colEl[0]]
      )
    ) {
      if (squares[colEl[0]] === "X") {
        winner = "X";
      } else {
        winner = "O";
      }
    }
  });

  const diagonal = Array(2)
    .fill([])
    .map((_, i) => {
      return lines.filter((_, j) => {
        if (i === 0) {
          return j % (size + 1) === 0;
        } else {
          return j % (size - 1) === 0 && j !== 0 && j !== size * size - 1;
        }
      });
    });

  diagonal.forEach((diagonalEl) => {
    if (
      diagonalEl.every(
        (value) => !!squares[value] && squares[value] === squares[diagonalEl[0]]
      )
    ) {
      if (squares[diagonalEl[0]] === "X") {
        winner = "X";
      } else {
        winner = "O";
      }
    }
  });
  console.log(winner);

  return winner;
}

export default App;
