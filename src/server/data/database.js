var userId = 0;
var boardId = 0;
var cardListId = 0;
var cardId = 0;

export function User(params) {
  this.id = params.id || 'user' + (userId++);
  this.name = params.name;
}

export function Board(params) {
  this.id = params.id || 'board' + (boardId++);
  this.name = params.name;
}

export function CardList(params) {
  this.id = params.id || 'cardList' + (cardListId++);
  this.boardId = params.boardId;
  this.name = params.name;
  this.boardRank = params.rank;
}

export function Card(params) {
  this.id = params.id || 'card' + (cardId++);
  this.id = params.id;
  this.boardId = params.boardId;
  this.cardListId = params.cardListId;
  this.name = params.name;
  this.cardListRank = params.rank;
}

var users = [
  new User({id: 'luis_user', name: 'Luis'}),
  new User({id: 'dave_user', name: 'Dave'}),
];

var boards = [
  new Board({id: 'product_board', name: 'Product Roadmap'}),
  new Board({id: 'eng_board', name: 'Engineering'}),
];

var cardLists = [
  new CardList({
    id: 'product_opp_list',
    boardId: 'product_board',
    name: 'Opportunities',
    rank: 1,
  }),
  new CardList({
    id: 'product_backlog_list',
    boardId: 'product_board',
    name: 'Backlog',
    rank: 2,
  }),
  new CardList({
    id: 'product_active_list',
    boardId: 'product_board',
    name: 'Active',
    rank: 3,
  }),
  new CardList({
    id: 'eng_backlog_list',
    boardId: 'eng_board',
    name: 'Backlog',
    rank: 1,
  }),
  new CardList({
    id: 'eng_doing_list',
    boardId: 'eng_board',
    name: 'Doing',
    rank: 2,
  }),
  new CardList({
    id: 'eng_done_list',
    boardId: 'eng_board',
    name: 'Done',
    rank: 3,
  }),
];

var cards = [
  new Card({
    id: 'slack_card',
    boardId: 'product_board',
    cardListId: 'product_opp_list',
    name: 'Slack Integration',
    rank: 1,
  }),
  new Card({
    id: 'onboarding_card',
    boardId: 'product_board',
    cardListId: 'product_active_list',
    name: 'Onboarding',
    rank: 2,
  }),
  new Card({
    id: 'slack_oauth_card',
    boardId: 'eng_board',
    cardListId: 'eng_backlog_list',
    name: 'Slack Oauth integration',
    rank: 1,
  }),
  new Card({
    id: 'integration_card',
    boardId: 'eng_board',
    cardListId: 'eng_backlog_list',
    name: 'Integration data service',
    rank: 0,
  }),
  new Card({
    id: 'marketing_dash_card',
    boardId: 'eng_board',
    cardListId: 'eng_done_list',
    name: 'Marketing Dashboard',
    rank: 3,
  }),
  new Card({
    id: 'lowfi_card',
    boardId: 'eng_board',
    cardListId: 'eng_done_list',
    name: 'Create LowFi Workflow',
    rank: 4,
  }),
  new Card({
    id: 'email_card',
    boardId: 'eng_board',
    cardListId: 'eng_doing_list',
    name: 'Email notification on successful oauth connection.',
    rank: 5,
  })
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

export function addBoard(name) {
  boards.push(new Board(name));
  const lastBoard = boards.slice(-1)[0];
  return lastBoard.id;
}

export function renameBoard(id, name) {
  const board = getBoard(id);
  board.name = name;
}

export function removeBoard(id) {
  boards = boards.filter(board => board.id !== id);
  return id;
}

export function getCardLists(boardId) {
  return cardLists.filter((list) => list.boardId == boardId);
}

export function getCardList(id) {
  return cardLists.filter((list) => list.id == id)[0];
}

// Ordered by cardListRank
export function getCards(cardListId) {
  let c = cards.filter(card => card.cardListId === cardListId);
  c = c.sort((a, b) => {
    if (a.cardListRank >= b.cardListRank) {
      return 1;
    }
    if (a.cardListRank < b.cardListRank) {
      return -1;
    }
  });
  return c;
}

export function getCard(id) {
  return cards.filter((card) => card.id == id)[0];
}
