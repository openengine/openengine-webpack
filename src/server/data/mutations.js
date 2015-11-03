import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

const GraphQLChangeBoardStatusMutation = mutationWithClientMutationId({
  name: 'ChangeBoardStatus',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    complete: {type: new GraphQLNonNull(GraphQLBoolean)}
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    board: {
      type: GraphQLBoard,
      resolve: ({boardId}) => getBoard(boardId)
    }
  },
  mutateAndGetPayload: ({id, complete}) => {
    const {id: boardId} = fromGlobalId(id);
    changeBoardStatus(boardId, complete);
    return {boardId};
  }
});

const GraphQLRemoveBoardMutation = mutationWithClientMutationId({
  name: 'RemoveBoard',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({id}) => id
    }
  },
  mutateAndGetPayload: ({id}) => {
    const {id: boardId} = fromGlobalId(id);
    removeBoard(boardId);
    return {id};
  }
});

const GraphQLRenameBoardMutation = mutationWithClientMutationId({
  name: 'RenameBoard',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    board: {
      type: GraphQLBoard,
      resolve: ({boardId}) => getBoard(boardId)
    }
  },
  mutateAndGetPayload: ({id, name}) => {
    const {id: boardId} = fromGlobalId(id);
    renameBoard(boardId, name);
    return {boardId};
  }
});
