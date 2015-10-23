import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

import * as db from './database';

const nodeDefs = nodeDefinitions(
  globalId => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Board') {
      return db.getBoard(id);
    } else if (type === 'User') {
      return db.getUser(id);
    }
  },
  obj => {
    if (obj instanceof db.Board) {
      var BoardType = require('./BoardType');
      return BoardType;
    } else if (obj instanceof db.User) {
      var UserType = require('./UserType');
      return UserType;
    }
  }
);

export default nodeDefs;
