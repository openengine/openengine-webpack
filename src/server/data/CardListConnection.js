import {
  connectionDefinitions,
} from 'graphql-relay';

import CardListType from './CardListType';

export const {
  connectionType: CardListConnection,
  edgeType: CardListEdge,
} = connectionDefinitions({
  name: 'CardList',
  nodeType: CardListType
});
