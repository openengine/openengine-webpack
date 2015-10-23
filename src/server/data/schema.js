import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  connectionDefinitions,
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
} from 'graphql-relay';

import * as db from './database';

import UserType from './UserType';
import BoardType from './BoardType';
import AddBoardMutation from './AddBoardMutation';
import RemoveBoardMutation from './RemoveBoardMutation';
import RenameBoardMutation from './RenameBoardMutation';
import { nodeField } from './nodeInterface';

const RootQuery = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: UserType,
      resolve: db.getViewer
    },
    board: {
      type: BoardType,
      args: {
        id: {
          description: 'id of the board',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, { id }) => getBoard(fromGlobalId(id).id)
    },
    node: nodeField
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addBoard: AddBoardMutation,
    removeBoard: RemoveBoardMutation,
    renameBoard: RenameBoardMutation
  }
});

export const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
