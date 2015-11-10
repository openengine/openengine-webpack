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
  description: 'Move card wihthin or to another card list',
  inputFields: {
    cardId: { type: new GraphQLNonNull(GraphQLID)},
    fromCardListId: { type: new GraphQLNonNull(GraphQLID)},
    toCardListId: { type: new GraphQLNonNull(GraphQLID)},
    toRank: { type: GraphQLFloat },
  },
  outputFields: {
    fromCardList: {
      type: CardListType,
      resolve: ({fromCardListIdSimple}) => db.getCardList(fromCardListIdSimple),
    },
    toCardList: {
      type: CardListType,
      resolve: ({toCardListIdSimple}) => db.getCardList(toCardListIdSimple),
    },
  },
  mutateAndGetPayload: ({cardId, fromCardListId, toCardListId, toRank}) => {
    const {id: cardIdSimple} = fromGlobalId(cardId);
    const {id: fromCardListIdSimple} = fromGlobalId(fromCardListId);
    const {id: toCardListIdSimple} = fromGlobalId(toCardListId);
    db.moveCard(cardIdSimple, toCardListIdSimple, toRank);
    return {fromCardListIdSimple, toCardListIdSimple};
  },
});
