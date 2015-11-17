import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  fromGlobalId,
} from 'graphql-relay';

import * as db from './database';

import UserType from './UserType';
import BoardType from './BoardType';
import AddBoardMutation from './AddBoardMutation';
import RemoveBoardMutation from './RemoveBoardMutation';
import RenameBoardMutation from './RenameBoardMutation';
import MoveCardMutation from './MoveCardMutation';
import AddCardMutation from './AddCardMutation';
import DeleteCardMutation from './DeleteCardMutation';
import { nodeField } from './nodeInterface';

const RootQuery = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: UserType,
      resolve: db.getViewer,
    },
    board: {
      type: BoardType,
      args: {
        id: {
          description: 'id of the board',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (root, { id }) => {
        const {id: boardId} = fromGlobalId(id);
        return db.getBoard(boardId);
      },
    },
    node: nodeField,
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addBoard: AddBoardMutation,
    removeBoard: RemoveBoardMutation,
    renameBoard: RenameBoardMutation,
    moveCard: MoveCardMutation,
    addCard: AddCardMutation,
    deleteCard: DeleteCardMutation,
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
