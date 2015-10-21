export class Board extends Object {}

// Mock authenticated ID.
const VIEWER_ID = 'me';

const boardsById = {};
const boardIdsByUser = {
  [VIEWER_ID]: []
};
let nextBoardId = 0;

export function addBoard(title, complete) {
  const board = new Board();
  Object.assign(board, {
    complete: Boolean(complete),
    id: `${nextBoardId++}`,
    title
  });

  boardsById[board.id] = board;
  boardIdsByUser[VIEWER_ID].push(board.id);

  return board.id;
}

export function getBoard(id) {
  return boardsById[id];
}

export function changeBoardStatus(id, complete) {
  const board = getBoard(id);
  board.complete = complete;
}

export function getBoards(status = 'any') {
  const boards = boardIdsByUser[VIEWER_ID].map(id => boardsById[id]);
  if (status === 'any') {
    return boards;
  }

  return boards.filter(board => board.complete === (status === 'completed'));
}

export function markAllBoards(complete) {
  const changedBoards = [];
  getBoards().forEach(board => {
    if (board.complete !== complete) {
      board.complete = complete;
      changedBoards.push(board);
    }
  });
  return changedBoards.map(board => board.id);
}

export function removeBoard(id) {
  const boardIndex = boardIdsByUser[VIEWER_ID].indexOf(id);
  if (boardIndex !== -1) {
    boardIdsByUser[VIEWER_ID].splice(boardIndex, 1);
  }
  delete boardsById[id];
}

export function removeCompletedBoards() {
  const boardsToRemove = getBoards().filter(board => board.complete);
  boardsToRemove.forEach(board => removeBoard(board.id));
  return boardsToRemove.map(board => board.id);
}

export function renameBoard(id, title) {
  const board = getBoard(id);
  board.title = title;
}

// Mock board data.
addBoard('Product');
addBoard('Engineering');
