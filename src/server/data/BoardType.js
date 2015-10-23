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

var i = 0;
const BoardType = new GraphQLObjectType({
  xxxxxxxxxxxxxxx: (i+=1),
  name: 'Board',
  description: 'A board',
  fields: {
    id: globalIdField('Board'),
    title: { type: GraphQLString }
  },
  isTypeOf: db.Board,
  interfaces: [nodeInterface]
});

export default BoardType;
