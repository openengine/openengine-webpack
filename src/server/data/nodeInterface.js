import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

import * as db from './database';

const nodeDefs = nodeDefinitions(
  globalId => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return db.getUser(id);
    }
    if (type === 'Board') {
      return db.getBoard(id);
    }
    if (type === 'CardList') {
      return db.getCardList(id);
    }
    if (type === 'Card') {
      return db.getCard(id);
    }
  },
  obj => {
    if (obj instanceof db.User) {
      return require('./UserType');
    }
    if (obj instanceof db.Board) {
      return require('./BoardType');
    }
    if (obj instanceof db.CardList) {
      return require('./CardListType');
    }
    if (obj instanceof db.Card) {
      return require('./CardType');
    }
  }
);

export default nodeDefs;
