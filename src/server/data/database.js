export class Board extends Object {}
export class User extends Object {}

// Mock authenticated ID.
const VIEWER_ID = 'me';

// Mock user data.
const viewer = new User();
viewer.id = VIEWER_ID;
const usersById = {
  [VIEWER_ID]: viewer
};

const boardsById = {};
const boardIdsByUser = {
  [VIEWER_ID]: []
};
let nextBoardId = 0;

export function addBoard(text, complete) {
  const board = new Board();
  Object.assign(board, {
    complete: Boolean(complete),
    id: `${nextBoardId++}`,
    text
  });

  boardsById[board.id] = board;
  boardIdsByUser[VIEWER_ID].push(board.id);

  return board.id;
}

// Mock board data.
addBoard('Taste JavaScript', true);
addBoard('Buy a unicorn', false);

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

export function getUser() {
  return usersById[VIEWER_ID];
}

export function getViewer() {
  return getUser(VIEWER_ID);
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

export function renameBoard(id, text) {
  const board = getBoard(id);
  board.text = text;
}
