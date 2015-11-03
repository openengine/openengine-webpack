import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';

import BoardType from './BoardType';
import * as db from './database';

export default mutationWithClientMutationId({
  name: 'RenameBoard',
  description: 'Rename a board',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    board: {
      type: BoardType,
      resolve: ({boardId}) => db.getBoard(boardId)
    }
  },
  mutateAndGetPayload: ({id, name}) => {
    const {id: boardId} = fromGlobalId(id);
    db.renameBoard(boardId, name);
    return {boardId};
  }
});
