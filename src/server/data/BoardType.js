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
import { CardConnection } from './CardConnection';

const BoardType = new GraphQLObjectType({
  name: 'Board',
  description: 'A board',
  fields: {
    id: globalIdField('Board'),
    title: { type: GraphQLString },
    cards: {
      type: CardConnection,
      args: {
        ...connectionArgs
      },
      resolve: (obj, {...args}) => {
        let cards = db.getCards(obj.id);
        return connectionFromArray(cards, args)
      }
    },
  },
  isTypeOf: (value) => value instanceof db.Board,
  interfaces: [nodeInterface]
});

export default BoardType;
