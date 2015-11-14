import Relay from 'react-relay';

export default {
  board: () => Relay.QL`query { node(id: $boardId) }`,
  viewer: () => Relay.QL`query { viewer }`,
};
