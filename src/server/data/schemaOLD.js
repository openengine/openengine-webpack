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

////////////////////////////////////////////////////////////////////
//
// Objects & Connections
//
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
//
// Mutations
//
////////////////////////////////////////////////////////////////////
const GraphQLAddBoardMutation = mutationWithClientMutationId({
  name: 'AddBoard',
  inputFields: {
    title: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    boardEdge: {
      type: GraphQLBoardEdge,
      resolve: ({boardId}) => {
        const board = getBoard(boardId);
        return {
          cursor: cursorForObjectInConnection(getBoards(), board),
          node: board
        };
      }
    }
  },
  mutateAndGetPayload: ({title}) => {
    const boardId = addBoard(title);
    return {boardId};
  }
});

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

const GraphQLMarkAllBoardsMutation = mutationWithClientMutationId({
  name: 'MarkAllBoards',
  inputFields: {
    complete: {type: new GraphQLNonNull(GraphQLBoolean)}
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    changedBoards: {
      type: new GraphQLList(GraphQLBoard),
      resolve: ({changedBoardIds}) => changedBoardIds.map(getBoard)
    }
  },
  mutateAndGetPayload: ({complete}) => {
    const changedBoardIds = markAllBoards(complete);
    return {changedBoardIds};
  }
});

const GraphQLRemoveCompletedBoardsMutation = mutationWithClientMutationId({
  name: 'RemoveCompletedBoards',
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    deletedIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({deletedIds}) => deletedIds
    }
  },
  mutateAndGetPayload: () => {
    const deletedBoardIds = removeCompletedBoards();
    const deletedIds = deletedBoardIds.map(toGlobalId.bind(null, 'Board'));
    return {deletedIds};
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
    title: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    board: {
      type: GraphQLBoard,
      resolve: ({boardId}) => getBoard(boardId)
    }
  },
  mutateAndGetPayload: ({id, title}) => {
    const {id: boardId} = fromGlobalId(id);
    renameBoard(boardId, title);
    return {boardId};
  }
});

////////////////////////////////////////////////////////////////////
//
// Schema
//
////////////////////////////////////////////////////////////////////
