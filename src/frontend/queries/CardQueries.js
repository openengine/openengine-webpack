import Relay from 'react-relay';

export default {
  card: () => Relay.QL`query nodeQuery { node(id: $cardId) }`,
};
