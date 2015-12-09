import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class AssignCardMutation extends Relay.Mutation {
  static propTypes = {
    card: PropTypes.object,
  };
  getMutation() {
    return Relay.QL`mutation{assignCard}`;
  }
  getCollisionKey() {
    return `assign_${this.props.card.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AssignCardPayload {
        savedCard {
          assignedTo
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        savedCard: this.props.card.id,
      },
    },
  ];
  }
  getVariables() {
    return {
      id: this.props.card.id,
      assignedTo: this.props.assignedTo,
    };
  }
  // Let's craft an optimistic response that mimics the shape of the
  // SaveCardPayload, as well as the values we expect to receive.
  getOptimisticResponse() {
    return {
      savedCard: {
        id: this.props.card.id,
        assignedTo: this.props.assignedTo,
      },
    };
  }
  // This mutation decalres a dependency on the boardColumn to which the card is being moved (if any),
  // as well as the card's id and the id of the boardColumn to which it belongs.
  static fragments = {
    card: () => Relay.QL`
      fragment on Card {
        id
      }
    `,
  };
}
