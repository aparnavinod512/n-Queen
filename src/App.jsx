import { useState } from "react";
import "./App.css";

function createBoard(size) {
  return Array(size).fill(-1);
}

function findConflictingRows(queens) {
  const conflicts = new Set();

  for (let firstRow = 0; firstRow < queens.length; firstRow++) {
    const firstColumn = queens[firstRow];

    if (firstColumn === -1) continue;

    for (
      let secondRow = firstRow + 1;
      secondRow < queens.length;
      secondRow++
    ) {
      const secondColumn = queens[secondRow];

      if (secondColumn === -1) continue;

      const sameColumn = firstColumn === secondColumn;

      const sameDiagonal =
        Math.abs(firstRow - secondRow) ===
        Math.abs(firstColumn - secondColumn);

      if (sameColumn || sameDiagonal) {
        conflicts.add(firstRow);
        conflicts.add(secondRow);
      }
    }
  }

  return conflicts;
}

function App() {
  const [size, setSize] = useState(8);
  const [queens, setQueens] = useState(() => createBoard(8));
  const [message, setMessage] = useState(
    "Click a square to place a queen."
  );

  const conflictingRows = findConflictingRows(queens);
  const queensPlaced = queens.filter(
    (column) => column !== -1
  ).length;

  function handleSizeChange(event) {
    const newSize = Number(event.target.value);

    setSize(newSize);
    setQueens(createBoard(newSize));
    setMessage(`Created a ${newSize} × ${newSize} board.`);
  }

  function handleSquareClick(row, column) {
    const updatedQueens = [...queens];

    if (updatedQueens[row] === column) {
      updatedQueens[row] = -1;
      setMessage(`Removed the queen from row ${row + 1}.`);
    } else {
      updatedQueens[row] = column;

      const updatedConflicts =
        findConflictingRows(updatedQueens);

      const updatedQueenCount = updatedQueens.filter(
        (queenColumn) => queenColumn !== -1
      ).length;

      if (
        updatedQueenCount === size &&
        updatedConflicts.size === 0
      ) {
        setMessage("Success! All queens are placed safely.");
      } else if (updatedConflicts.size > 0) {
        setMessage(
          "Conflict detected! Red queens are attacking each other."
        );
      } else {
        setMessage(
          `Queen placed safely at row ${row + 1}, column ${
            column + 1
          }.`
        );
      }
    }

    setQueens(updatedQueens);
  }

  function handleReset() {
    setQueens(createBoard(size));
    setMessage("The board was cleared.");
  }

  return (
    <main className="app">
      <header>
        <h1>N-Queens Visualizer</h1>
        <p>
          Place N queens so that no two queens attack each other.
        </p>
      </header>

      <section className="controls">
        <label htmlFor="board-size">Board size</label>

        <select
          id="board-size"
          value={size}
          onChange={handleSizeChange}
        >
          {[4, 5, 6, 7, 8, 9, 10, 11, 12].map(
            (boardSize) => (
              <option key={boardSize} value={boardSize}>
                {boardSize} × {boardSize}
              </option>
            )
          )}
        </select>

        <button onClick={handleReset}>Reset</button>
      </section>

      <p
        className={`message ${
          conflictingRows.size > 0 ? "error-message" : ""
        }`}
      >
        {message}
      </p>

      <section
        className="chessboard"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
        }}
      >
        {Array.from({ length: size * size }).map(
          (_, index) => {
            const row = Math.floor(index / size);
            const column = index % size;
            const isLight = (row + column) % 2 === 0;
            const hasQueen = queens[row] === column;
            const hasConflict =
              hasQueen && conflictingRows.has(row);

            return (
              <button
                key={`${row}-${column}`}
                className={`square ${
                  isLight ? "light-square" : "dark-square"
                } ${hasConflict ? "conflict-square" : ""}`}
                onClick={() =>
                  handleSquareClick(row, column)
                }
                aria-label={`Row ${row + 1}, column ${
                  column + 1
                }`}
              >
                {hasQueen && (
                  <span
                    className={`queen ${
                      hasConflict
                        ? "conflicting-queen"
                        : "safe-queen"
                    }`}
                  >
                    ♛
                  </span>
                )}
              </button>
            );
          }
        )}
      </section>

      <div className="status-panel">
        <p>
          Queens placed: {queensPlaced} / {size}
        </p>

        <p>
          Conflicting queens: {conflictingRows.size}
        </p>
      </div>
    </main>
  );
}

export default App;