import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionFromArray,
  connectionArgs
} from 'graphql-relay';

import * as db from './database';

import { nodeInterface } from './nodeInterface';
import { BoardConnection } from './BoardConnection';

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: () => ({
    id: globalIdField('User'),
    name: { type: GraphQLString },
    boards: {
      type: BoardConnection,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any'
        },
        ...connectionArgs
      },
      resolve: (obj, {status, ...args}) => {
        return connectionFromArray(db.getBoards(), args)
      }
    },
  }),
  isTypeOf: (value) => value instanceof db.User,
  interfaces: [nodeInterface]
});

export default UserType;
