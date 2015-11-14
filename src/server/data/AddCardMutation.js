import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from 'graphql';

import {
  cursorForObjectInConnection,
  mutationWithClientMutationId,
  fromGlobalId,
} from 'graphql-relay';

import CardListType from './CardListType';
import { CardEdge } from './CardConnection';
import * as db from './database';

export default mutationWithClientMutationId({
  name: 'AddCard',
  description: 'Add a new card to a cardList',
  inputFields: {
    cardListId: { type: new GraphQLNonNull(GraphQLID)},
    userId: { type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    description: {type: GraphQLString},
  },
  outputFields: {
    cardList: {
      type: CardListType,
      resolve: ({cardListIdSimple}) => db.getCardList(cardListIdSimple),
    },
    newCardEdge: {
      type: CardEdge,
      resolve: ({newCardId, cardListIdSimple}) => {
        const card = db.getCard(newCardId);
        return {
          cursor: cursorForObjectInConnection(db.getCards(cardListIdSimple), card),
          node: card,
        };
      },
    },
  },
  mutateAndGetPayload: ({cardListId, name, description, userId}) => {
    const {id: cardListIdSimple} = fromGlobalId(cardListId);
    const {id: userIdSimple} = fromGlobalId(userId);
    const newCardId = db.addCard(name, description, cardListIdSimple, userIdSimple);
    return {cardListIdSimple, newCardId};
  },
});
