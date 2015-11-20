import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';

export default class RemoveCardMutation extends Relay.Mutation {
  static propTypes = {
    card: PropTypes.object,
    boardColumn: PropTypes.object,
  };
  getMutation() {
    return Relay.QL`mutation{removeCard}`;
  }
  getCollisionKey() {
    return `check_${this.props.card.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveCardPayload {
        removedFromBoardColumn { cards },
        removedCardId,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'removedFromBoardColumn',
      parentID: this.props.boardColumn.id,
      connectionName: 'cards',
      deletedIDFieldName: 'removedCardId',
    }];
  }
  getVariables() {
    return {
      cardId: this.props.card.id,
    };
  }
  // This mutation declares a dependency on the boardColumn to which the card it is being added
  static fragments = {
    card: () => Relay.QL`
      fragment on Card {
        id
      }
    `,
    boardColumn: () => Relay.QL`
      fragment on BoardColumn {
        id
      }
    `,
  };
}
