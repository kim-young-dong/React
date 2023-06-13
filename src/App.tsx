import { useState } from 'react';
import './App.css';

function Square(props: {
  value: string;
  handleValue: () => void;
  isWinnerSquare: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center border-[1px] text-base font-bold h-9 mt-[-1px] mr-[-1px] text-center w-9  border-[#999] ${
        props.isWinnerSquare ? ' bg-red-600' : ''
      }`}
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
    if (winner.player === 'Draw') {
      alert('무승부입니다.');
      return;
    }

    if (winner.player) {
      alert('이미 승리자가 있습니다.');
      return;
    }

    if (props.squares[i]) {
      alert('이미 선택된 칸입니다.');
      return;
    }

    const newSquares = [...props.squares];

    newSquares[i] = props.isXNext ? 'X' : 'O';
    props.onPlay(newSquares);
  };

  const winner: { player: string | null; line: any[] | null } = calculateWinner(
    props.squares,
    props.size,
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
        <div className="flex items-center justify-center" key={i}>
          {renderCollumn}
        </div>
      );
    });

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="">
          {winner.player
            ? winner.player !== 'Draw'
              ? `Winner is: ${winner.player}`
              : 'Draw'
            : `Next Player is: ${props.isXNext ? 'X' : 'O'}`}
        </div>
        <div>{renderRow}</div>
      </div>
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
    if (!newSize || newSize === boardSize) {
      return;
    }

    setBoardSize(() => {
      return newSize;
    });
    setHistory(() => [Array(newSize * newSize).fill('')]);
    setCurrentStep(0);
    setIsXNext(true);
  };

  const handlePlay = (newSquares: any) => {
    const newHistory = [...history.slice(0, currentStep + 1), newSquares];
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
    setIsXNext(!isXNext);
  };

  const jumpTo = (index: number) => {
    setCurrentStep(index);
    setIsXNext(index % 2 === 0);
  };

  const buttonText = (index: number): string => {
    const currentElIndex = history[index].findIndex((value, idx) => {
      return value !== history[index - 1]?.[idx];
    });

    const row = Math.ceil((currentElIndex + 1) / boardSize);
    const col = (currentElIndex % boardSize) + 1;
    if (index === 0) {
      return 'Go to game start';
    } else if (index === history.length - 1) {
      return `Current playing is #${index} (${row}행, ${col}열)`;
    } else {
      return `Go to move #${index} (${row}행, ${col}열)`;
    }
  };

  const historyList = history.map((value, index) => {
    return (
      <li className="flex w-full" key={index}>
        <button
          className={
            `p-2 rounded-md w-full` +
            (index === currentStep && index !== 0
              ? ' text-white font-bold bg-blue-950'
              : '') +
            (index === 0 ? ' bg-blue-500 text-white' : ' bg-slate-300')
          }
          onClick={() => jumpTo(index)}
        >
          {buttonText(index)}
        </button>
      </li>
    );
  });

  return (
    <>
      <div className="flex justify-center gap-8">
        <div className="flex flex-col gap-4 ">
          <div className="flex items-center justify-center gap-4">
            <input
              className="px-2 py-1 border-2 border-blue-500 rounded-md"
              type="number"
              onChange={(event) => {
                newSize = parseInt((event.target as HTMLInputElement).value);
              }}
            />
            <button
              className="px-2 py-1 text-white bg-blue-500 rounded-md"
              onClick={() => {
                changeBoarderSize();
              }}
            >
              적용
            </button>
          </div>
          <div>
            <Board
              squares={squares}
              size={boardSize}
              isXNext={isXNext}
              onPlay={handlePlay}
            />
          </div>
        </div>
        <ol className="flex flex-col gap-2 items-center w-[280px]">
          {historyList}
        </ol>
      </div>
    </>
  );
}

// 승자 계산 함수
function calculateWinner(
  squares: string[],
  size: number,
): { player: string | null; line: any[] | null } {
  if (squares.every((value) => !!value)) {
    return {
      player: 'Draw',
      line: null,
    };
  }

  const lines = Array(squares.length)
    .fill(null)
    .map((_, i) => {
      return i;
    });

  let winner: { player: string | null; line: any[] | null } = {
    player: null,
    line: null,
  };

  // 행 검사
  const row = Array(size)
    .fill([])
    .map((_, i) => {
      return lines.slice(i * size, i * size + size);
    });

  row.forEach((rowEl) => {
    if (
      rowEl.every(
        (value) => !!squares[rowEl[0]] && squares[value] === squares[rowEl[0]],
      )
    ) {
      winner.line = rowEl;
      if (squares[rowEl[0]] === 'X') {
        winner.player = 'X';
      } else {
        winner.player = 'O';
      }
    }
  });

  // 열 검사
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
        (value) => !!squares[colEl[0]] && squares[value] === squares[colEl[0]],
      )
    ) {
      winner.line = colEl;
      if (squares[colEl[0]] === 'X') {
        winner.player = 'X';
      } else {
        winner.player = 'O';
      }
    }
  });

  // 대각선 검사
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
        (value) =>
          !!squares[value] && squares[value] === squares[diagonalEl[0]],
      )
    ) {
      winner.line = diagonalEl;
      if (squares[diagonalEl[0]] === 'X') {
        winner.player = 'X';
      } else {
        winner.player = 'O';
      }
    }
  });

  return winner;
}

export default App;
