import Relay from 'react-relay';

export default {
  card: () => Relay.QL`query { node(id: $cardId) }`
};
