import {
  connectionDefinitions,
} from 'graphql-relay';

import CardType from './CardType';

export const {
  connectionType: CardConnection,
  edgeType: CardEdge,
} = connectionDefinitions({
  name: 'Card',
  nodeType: CardType
});
