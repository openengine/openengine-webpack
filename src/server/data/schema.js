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

import {
  Board,
  User,
  addBoard,
  changeBoardStatus,
  getBoard,
  getBoards,
  getUser,
  getViewer,
  markAllBoards,
  removeCompletedBoards,
  removeBoard,
  renameBoard,
} from './database';

/* eslint-disable no-use-before-define */

const {nodeInterface, nodeField} = nodeDefinitions(
  globalId => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Board') {
      return getBoard(id);
    } else if (type === 'User') {
      return getUser(id);
    }
  },
  obj => {
    if (obj instanceof Board) {
      return GraphQLBoard;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
  }
);

const GraphQLBoard = new GraphQLObjectType({
  name: 'Board',
  fields: {
    id: globalIdField('Board'),
    text: {
      type: GraphQLString,
      resolve: obj => obj.text
    },
    complete: {
      type: GraphQLBoolean,
      resolve: obj => obj.complete
    }
  },
  interfaces: [nodeInterface]
});

const {
  connectionType: BoardsConnection,
  edgeType: GraphQLBoardEdge,
} = connectionDefinitions({
  name: 'Board',
  nodeType: GraphQLBoard
});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    boards: {
      type: BoardsConnection,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any'
        },
        ...connectionArgs
      },
      resolve: (obj, {status, ...args}) =>
        connectionFromArray(getBoards(status), args)
    },
    numBoards: {
      type: GraphQLInt,
      resolve: () => getBoards().length
    },
    numCompletedBoards: {
      type: GraphQLInt,
      resolve: () => getBoards('completed').length
    }
  },
  interfaces: [nodeInterface]
});

const GraphQLRoot = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: getViewer
    },
    node: nodeField
  }
});

const GraphQLAddBoardMutation = mutationWithClientMutationId({
  name: 'AddBoard',
  inputFields: {
    text: {type: new GraphQLNonNull(GraphQLString)}
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
  mutateAndGetPayload: ({text}) => {
    const boardId = addBoard(text);
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
    text: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    board: {
      type: GraphQLBoard,
      resolve: ({boardId}) => getBoard(boardId)
    }
  },
  mutateAndGetPayload: ({id, text}) => {
    const {id: boardId} = fromGlobalId(id);
    renameBoard(boardId, text);
    return {boardId};
  }
});

const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addBoard: GraphQLAddBoardMutation,
    changeBoardStatus: GraphQLChangeBoardStatusMutation,
    markAllBoards: GraphQLMarkAllBoardsMutation,
    removeCompletedBoards: GraphQLRemoveCompletedBoardsMutation,
    removeBoard: GraphQLRemoveBoardMutation,
    renameBoard: GraphQLRenameBoardMutation
  }
});

export default new GraphQLSchema({
  query: GraphQLRoot,
  mutation: GraphQLMutation
});

