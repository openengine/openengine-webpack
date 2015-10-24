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
    if (type === 'Card') {
      return db.getCard(id);
    }
  },
  obj => {
    if (obj instanceof db.User) {
      var UserType = require('./UserType');
      return UserType;
    }
    if (obj instanceof db.Board) {
      var BoardType = require('./BoardType');
      return BoardType;
    }
    if (obj instanceof db.Card) {
      var CardType = require('./CardType');
      return CardType;
    }
  }
);

export default nodeDefs;
