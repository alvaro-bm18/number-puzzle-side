import { useState } from "react";
import propTypes from "prop-types";
import "./App.css";

function NumberTag({ number, onMove, isLast }) {
  return (
    <div
      className={`number-container ${isLast ? "empty" : ""}`.trimEnd()}
      onClick={onMove}
    >
      {!isLast && number}
    </div>
  );
}

NumberTag.propTypes = {
  number: propTypes.number.isRequired,
  onMove: propTypes.func.isRequired,
  isLast: propTypes.bool.isRequired,
};

function App() {
  const MAX = 7;
  const MIN = 3;

  const [game, setGame] = useState({
    columns: MIN,
    board: getRandomBoard(MIN),
    movs: 0,
    isWinner: false,
  });

  const gridBoard = {
    display: "grid",
    gridTemplateColumns: `${String(300 / game.columns)
      .concat("px ")
      .repeat(game.columns)}`,
  };

  function getRandomBoard(numberOfColumns) {
    const MAX_columns = numberOfColumns * numberOfColumns;
    const RandomBoard = [];
    do {
      let index = Math.round(Math.random() * (MAX_columns - 1) + 1);
      if (!RandomBoard.includes(index)) {
        RandomBoard.push(index);
      }
    } while (RandomBoard.length != MAX_columns);
    return RandomBoard;
  }

  function moveNumber(index) {
    const lastNumber = game.columns * game.columns;
    const indexLastNumber = game.board.indexOf(lastNumber);
    let top = index - game.columns;
    let bottom = index + game.columns;
    let left = index % game.columns === 0 ? index : index - 1;
    let right = (index + 1) % game.columns === 0 ? index : index + 1;
    const positions = [top, left, right, bottom];

    if (positions.includes(indexLastNumber)) {
      const newBoard = [...game.board];
      newBoard[indexLastNumber] = game.board[index];
      newBoard[index] = lastNumber;
      const gameChanges = {
        ...game,
        board: newBoard,
        movs: game.movs + 1,
        isWinner: isWinnerThisBoard(newBoard),
      };
      setGame(gameChanges);
    }
  }

  function isWinnerThisBoard(gameBoard) {
    for (let i = 0; i < gameBoard.length - 1; i++) {
      if (gameBoard[i] > gameBoard[i + 1]) {
        return false;
      }
    }
    return true;
  }

  function restoreWith(columnsBoard) {
    const restoredGame = {
      columns: columnsBoard,
      board: getRandomBoard(columnsBoard),
      movs: 0,
      isWinner: false,
    };
    setGame(restoredGame);
  }

  function WinnerWindow() {
    return (
      <div className="lightBoxWinner">
        <div className="boxWinner">
          <h1>Congratulation you won!</h1>
          <p>total movements: {game.movs}</p>
          <div>
            <button
              onClick={() => {
                restoreWith(game.columns);
              }}
            >
              keep playing
            </button>
            {game.columns < MAX && (
              <button
                onClick={() => {
                  restoreWith(game.columns + 1);
                }}
              >
                Next level
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {game.isWinner && <WinnerWindow />}
      <strong>Number puzzle side</strong>
      <p>movements: {game.movs}</p>
      <div className="board-container" style={gridBoard}>
        {game.board.map((number, index) => (
          <NumberTag
            key={index}
            number={number}
            onMove={() => {
              moveNumber(index);
            }}
            isLast={number === game.columns * game.columns ? true : false}
          />
        ))}
      </div>
      <select
        value={game.columns}
        onChange={(e) => restoreWith(Number(e.target.value))}
        className="selectOptions"
      >
        {Array(MAX - MIN)
          .fill(null)
          .map((items, index) => (
            <option key={index} value={index + MIN}>
              {`${index + MIN} columns`}
            </option>
          ))}
      </select>
    </>
  );
}
export default App;
