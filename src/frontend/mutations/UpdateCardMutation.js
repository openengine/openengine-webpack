import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class UpdateCardMutation extends Relay.Mutation {
  static propTypes = {
    card: PropTypes.object,
  };
  getMutation() {
    return Relay.QL`mutation{updateCard}`;
  }
  getCollisionKey() {
    return `update_${this.props.card.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateCardPayload {
        updatedCard
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        updatedCard: this.props.card.id,
      },
    },
  ];
  }
  getVariables() {
    return {
      id: this.props.card.id,
      name: this.props.name,
      description: this.props.description,
      dueDate: this.props.dueDate,
    };
  }
  // Let's craft an optimistic response that mimics the shape of the
  // SaveCardPayload, as well as the values we expect to receive.
  getOptimisticResponse() {
    return {
      updatedCard: {
        id: this.props.card.id,
        name: this.props.name,
        description: this.props.description,
        dueDate: this.props.dueDate,
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
