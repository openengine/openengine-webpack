import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  cursorForObjectInConnection,
  mutationWithClientMutationId,
} from 'graphql-relay';

import UserType from './UserType';
import { BoardEdge } from './BoardConnection';
import * as db from './database';

export default mutationWithClientMutationId({
  name: 'AddBoard',
  description: 'Create a new board',
  inputFields: {
    title: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: UserType,
      resolve: db.getViewer
    },
    boardEdge: {
      type: BoardEdge,
      resolve: ({boardId}) => {
        const board = db.getBoard(boardId);
        return {
          cursor: cursorForObjectInConnection(getBoards(), board),
          node: board
        };
      }
    }
  },
  mutateAndGetPayload: ({title}) => {
    const boardId = db.addBoard(title);
    return {boardId};
  }
});
