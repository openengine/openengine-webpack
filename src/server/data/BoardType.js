import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
} from 'graphql-relay';

import { nodeInterface } from './nodeInterface';

import * as db from './database';

const BoardType = new GraphQLObjectType({
  name: 'Board',
  description: 'A board',
  fields: {
    id: globalIdField('Board'),
    title: { type: GraphQLString }
  },
  isTypeOf: (value) => value instanceof db.Board,
  interfaces: [nodeInterface]
});

export default BoardType;
