import {
  connectionDefinitions,
} from 'graphql-relay';

import boardType from './boardType';

export const {
  connectionType: BoardConnection,
  edgeType: BoardEdge,
} = connectionDefinitions({
  name: 'Board',
  nodeType: boardType
});
