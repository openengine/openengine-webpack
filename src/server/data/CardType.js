import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';

import {
  globalIdField,
} from 'graphql-relay';

import * as db from './database';
import { nodeInterface } from './nodeInterface';

const CardType = new GraphQLObjectType({
  name: 'Card',
  description: 'A card',
  fields: () => ({
    id: globalIdField('Card'),
    name: { type: GraphQLString },
    cardListRank: { type: GraphQLFloat },
  }),
  isTypeOf: (value) => value instanceof db.Card,
  interfaces: [nodeInterface],
});

export default CardType;
