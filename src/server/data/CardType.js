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

const CardType = new GraphQLObjectType({
  name: 'Card',
  description: 'A card',
  fields: () => ({
    id: globalIdField('Card'),
    title: { type: GraphQLString },
  }),
  isTypeOf: (value) => value instanceof db.Card,
  interfaces: [nodeInterface]
});

export default CardType;