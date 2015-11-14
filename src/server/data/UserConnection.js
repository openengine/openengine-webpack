// This is required right now because of a fucked up bug in Relay
// https://github.com/facebook/relay/issues/112
// We can't have plural objects on the Root Query... so we need to attach a
// "Users" connection to the viewer...

import {
  connectionDefinitions,
} from 'graphql-relay';

import UserType from './UserType';

export const {
  connectionType: UserConnection,
  edgeType: UserEdge,
} = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});
