import {
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import {
  mutationWithClientMutationId,
  fromGlobalId,
} from 'graphql-relay';

import CardListType from './CardListType';
import * as db from './database';

export default mutationWithClientMutationId({
  name: 'DeleteCard',
  description: 'Deletes a card',
  inputFields: {
    cardId: { type: new GraphQLNonNull(GraphQLID)},
    cardListId: { type: new GraphQLNonNull(GraphQLID)},
  },
  outputFields: {
    deletedCardId: {
      type: GraphQLID,
      resolve: ({cardId}) => cardId,
    },
    cardList: {
      type: CardListType,
      resolve: ({cardListIdSimple}) => db.getCardList(cardListIdSimple),
    },
  },
  mutateAndGetPayload: ({cardId, cardListId}) => {
    const localCardId = fromGlobalId(cardId).id;
    const {id: cardListIdSimple} = fromGlobalId(cardListId);
    db.removeCard(localCardId);
    return {cardId, cardListIdSimple};
  },
});
