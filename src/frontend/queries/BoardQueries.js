import Relay from 'react-relay';

export default {
  board: () => Relay.QL`query boardQuery { node(id: $boardId) }`,
  viewer: () => Relay.QL`query viewerQuery { viewer }`,
};
