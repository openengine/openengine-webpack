var userId = 0;
var boardId = 0;
var cardId = 0;

export function User(name) {
  this.id = 'user' + (userId++);
  this.name = name;
}

export function Board(title) {
  this.id = 'board' + (boardId++);
  this.title = title;
}

export function Card(boardId, title, description, attendees) {
  this.id = 'card' + (cardId++);
  this.board = boardId;
  this.title = title;
  this.description = description;
}

var users = [
  new User('Luis'),
  new User('Dave')
];

var boards = [
  new Board('Product Roadmap'),
  new Board('Engineering'),
  new Board('Design')
];

var cards = [
  new Card('board1', 'Slack Integration', 'Customers would like to integrate with Slack to make their lives easier.'),
  new Card('board1', 'Onboarding', 'We have a core value around education and our onboarding flow is a great place to bring that to life.'),
  new Card('board2', 'Slack Oauth integration', 'Setup the core oauth flow for users to connect their account.'),
  new Card('board2', 'Integration data service', 'Persist integration information.'),
  new Card('board2', 'Email notification on successful oauth connection.', 'NodeConf is the longest running community driven conference for the Node community.', [1,2])
];

export function getUser(id) {
  return users.filter((user) => user.id == id)[0];
}

export function getViewer() {
  return users[0];
}

export function getBoards() {
  return boards;
}

export function getBoard(id) {
  return boards.filter((board) => board.id == id)[0];
}

export function addBoard(title) {
  boards.push(new Board(title));
  const lastBoard = boards.slice(-1)[0];
  return lastBoard.id;
}

export function renameBoard(id, title) {
  const board = getBoard(id);
  board.title = title;
}

export function removeBoard(id) {
  boards = boards.filter((board) => board.id != id);
  return id;
}
