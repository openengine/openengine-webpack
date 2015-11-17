let userId = 0;
let boardId = 0;
let cardListId = 0;
let cardId = 0;

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
  this.description = params.description;
  this.cardListRank = params.rank;
  if (params.user) {
    this.userId = params.user.id;
    this.assignedTo = params.user.name;
  }
}

const users = [
  new User({id: 'luis_user', name: 'Luis Escobedo'}),
  new User({id: 'dave_user', name: 'Dave Bryand'}),
];

let boards = [
  new Board({id: 'product_board', name: 'Product Roadmap'}),
  new Board({id: 'eng_board', name: 'Engineering'}),
];

const cardLists = [
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

let cards = [
  new Card({
    id: 'slack_card',
    boardId: 'product_board',
    cardListId: 'product_opp_list',
    name: 'Slack Integration',
    rank: 1,
  }),
  new Card({
    id: 'lowfi_card',
    boardId: 'eng_board',
    cardListId: 'eng_done_list',
    name: 'Create LowFi Workflow',
    rank: 4,
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
    id: 'email_card',
    boardId: 'eng_board',
    cardListId: 'eng_doing_list',
    name: 'Email notification on successful oauth connection.',
    rank: 5,
  }),
];

export function getUser(id) {
  return users.filter((user) => user.id === id)[0];
}

export function getUsers() {
  return users;
}

export function getViewer() {
  return users[0];
}

export function getBoards() {
  return boards;
}

export function getBoard(id) {
  return boards.filter((board) => board.id === id)[0];
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

export function getCardLists(id) {
  return cardLists.filter((list) => list.boardId === id);
}

export function getCardList(id) {
  return cardLists.filter((list) => list.id === id)[0];
}

// Ordered by cardListRank
export function getCards(listId) {
  const filteredCards = cards.filter(card => card.cardListId === listId);
  return filteredCards;
}

export function getCard(id) {
  return cards.filter((card) => card.id === id)[0];
}

export function addCard(name, description, cListId, cardUserId) {
  const id = name;
  const cList = getCardList(cListId);
  // Get the smallest rank to put new Card at top spot
  const rankVals = cards.filter(card => card.cardListId === cListId).map((cld)=> cld.cardListRank);
  const minRank = Math.min.apply(Math, rankVals);
  const newRank = minRank - 1;
  let user = '';
  if (cardUserId) {
    user = getUser(cardUserId);
  }
  cards.push(new Card({id, name, description, cardListId: cListId, boardId: cList.boardId, rank: newRank, user }));
  const lastCard = cards.slice(-1)[0];
  return lastCard.id;
}

export function removeCard(id) {
  cards = cards.filter(card => card.id !== id);
  return id;
}

export function moveCard(id, toCardListId, toRank) {
  const card = getCard(id);
  card.cardListId = toCardListId;
  card.cardListRank = toRank;
  return toCardListId;
}
