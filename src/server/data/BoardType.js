import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField,
  connectionFromArray,
  connectionArgs,
} from 'graphql-relay';

import * as db from './database';
import { nodeInterface } from './nodeInterface';
import { CardListConnection } from './CardListConnection';

const BoardType = new GraphQLObjectType({
  name: 'Board',
  description: 'A board',
  fields: {
    id: globalIdField('Board'),
    name: { type: GraphQLString },
    cardLists: {
      type: CardListConnection,
      args: {
        ... connectionArgs,
      },
      resolve: (obj, {...args}) => {
        const cardLists = db.getCardLists(obj.id);
        return connectionFromArray(cardLists, args);
      },
    },
  },
  isTypeOf: (value) => value instanceof db.Board,
  interfaces: [nodeInterface],
});

export default BoardType;
