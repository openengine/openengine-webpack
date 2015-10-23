import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

import * as db from './database';
//import UserType from './UserType';
//import BoardType from './BoardType';

/**
 * Given a function to map from an ID to an underlying object, and a function
 * to map from an underlying object to the concrete GraphQLObjectType it
 * corresponds to, constructs a `Node` interface that objects can implement,
 * and a field config for a `node` root field.
 *
 * If the typeResolver is omitted, object resolution on the interface will be
 * handled with the `isTypeOf` method on object types, as with any GraphQL
 * interface without a provided `resolveType` method.
 *
 * https://github.com/graphql/graphql-relay-js/blob/9e7401450c2458c6a45048a049c785100f3a622b/src/node/node.js#L107
 */

const nodeDefs = nodeDefinitions(
  globalId => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Board') {
      return db.getBoard(id);
    } else if (type === 'User') {
      return db.getUser(id);
    }
  },
  obj => {
    if (obj instanceof db.Board) {
      return BoardType;
    } else if (obj instanceof db.User) {
      return UserType;
    }
  }
);

export default nodeDefs;
