import { useState } from "react";
import "./App.css";

function Square(props: {
  value: string;
  handleValue: () => void;
  isWinnerSquare: boolean;
}) {
  return (
    <div
      className={`${props.isWinnerSquare ? "winner-square" : "square"}`}
      onClick={props.handleValue}
    >
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
    if (winner.player) {
      console.log("이미 승리자가 있습니다.");
      return;
    }

    if (props.squares[i]) {
      console.log("이미 선택된 칸입니다.");
      return;
    }

    const newSquares = [...props.squares];

    newSquares[i] = props.isXNext ? "X" : "O";
    props.onPlay(newSquares);
  };
  const winner: { player: string | null; line: any[] | null } = calculateWinner(
    props.squares,
    props.size
  );

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
              isWinnerSquare={
                winner.line ? winner.line.includes(i * props.size + j) : false
              }
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
        {winner.player
          ? `Winner is: ${winner.player}`
          : `Next Player is: ${props.isXNext ? "X" : "O"}`}
      </div>
      {renderRow}
    </>
  );
}

function App() {
  const [boardSize, setBoardSize] = useState(3);
  const [isXNext, setIsXNext] = useState(true);
  const [history, setHistory] = useState([
    Array(boardSize * boardSize).fill(null),
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const squares = history[currentStep];

  let newSize: number;

  const changeBoarderSize = () => {
    setBoardSize(() => {
      return newSize;
    });
    setHistory(() => [Array(newSize * newSize).fill("")]);
  };

  const handlePlay = (newSquares: any) => {
    const newHistory = [...history.slice(0, currentStep + 1), newSquares];
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
    setIsXNext(!isXNext);
    console.log(newHistory);
  };

  const jumpTo = (index: number) => {
    setCurrentStep(index);
    setIsXNext(index % 2 === 0);
  };

  const historyList = history.map((value, index) => {
    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{index}</button>
      </li>
    );
  });

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
            changeBoarderSize();
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
      <ol>{historyList}</ol>
    </>
  );
}

// 승자 계산 함수
function calculateWinner(
  squares: string[],
  size: number
): { player: string | null; line: any[] | null } {
  const lines = Array(squares.length)
    .fill(null)
    .map((_, i) => {
      return i;
    });

  let winner: { player: string | null; line: any[] | null } = {
    player: null,
    line: null,
  };

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
      winner.line = rowEl;
      if (squares[rowEl[0]] === "X") {
        winner.player = "X";
      } else {
        winner.player = "O";
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
      winner.line = colEl;
      if (squares[colEl[0]] === "X") {
        winner.player = "X";
      } else {
        winner.player = "O";
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
      winner.line = diagonalEl;
      if (squares[diagonalEl[0]] === "X") {
        winner.player = "X";
      } else {
        winner.player = "O";
      }
    }
  });

  console.log(winner.line);

  return winner;
}

export default App;
