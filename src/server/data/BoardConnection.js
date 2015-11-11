import {
  connectionDefinitions,
} from 'graphql-relay';

import BoardType from './BoardType';

export const {
  connectionType: BoardConnection,
  edgeType: BoardEdge,
} = connectionDefinitions({
  name: 'Board',
  nodeType: BoardType,
});
