import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
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

const CardType = new GraphQLObjectType({
  name: 'Card',
  description: 'A card',
  fields: () => ({
    id: globalIdField('Card'),
    name: { type: GraphQLString },
    cardListRank: { type: GraphQLInt },
  }),
  isTypeOf: (value) => value instanceof db.Card,
  interfaces: [nodeInterface]
});

export default CardType;
