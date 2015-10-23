import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';

import UserType from './UserType';
import * as db from './database';

export default mutationWithClientMutationId({
  name: 'RemoveBoard',
  description: 'Delete a board',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: UserType,
      resolve: db.getViewer
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({id}) => id
    }
  },
  mutateAndGetPayload: ({id}) => {
    const {id: boardId} = fromGlobalId(id);
    db.removeBoard(boardId);
    return {id};
  }
});
