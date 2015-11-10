import {
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLID,
} from 'graphql';

import {
  mutationWithClientMutationId,
  fromGlobalId,
} from 'graphql-relay';

import CardListType from './CardListType';
import * as db from './database';

export default mutationWithClientMutationId({
  name: 'MoveCard',
  description: 'Move card to another card list',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID)},
    toCardListId: { type: new GraphQLNonNull(GraphQLID)},
    toRank: { type: GraphQLFloat },
  },
  outputFields: {
    cardList: {
      type: CardListType,
      resolve: ({cardListId}) => db.getCardList(cardListId),
    },
  },
  mutateAndGetPayload: ({id, toCardListId, toRank}) => {
    const {id: cardId} = fromGlobalId(id);
    const {id: localCardListId} = fromGlobalId(toCardListId);
    const cardListId = db.moveCard(cardId, localCardListId, toRank);
    return {cardListId};
  },
});
