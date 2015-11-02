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
import { CardConnection } from './CardConnection';

const CardListType = new GraphQLObjectType({
  name: 'CardList',
  description: 'A board list that can contain cards',
  fields: {
    id: globalIdField('CardList'),
    name: { type: GraphQLString },
    boardRank: { type: GraphQLInt },
    cards: {
      type: CardConnection,
      args: {
        ... connectionArgs
      },
      resolve: (obj, {...args}) => {
        let cards = db.getCards(obj.id);
        return connectionFromArray(cards, args)
      }
    },
  },
  isTypeOf: (value) => value instanceof db.CardList,
  interfaces: [nodeInterface]
});

export default CardListType;
