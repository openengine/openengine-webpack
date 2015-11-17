import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class DeleteCardMutation extends Relay.Mutation {
  static propTypes = {
    card: PropTypes.object,
    boardColumn: PropTypes.object,
  };
  getMutation() {
    return Relay.QL`mutation{deleteCard}`;
  }
  getCollisionKey() {
    return `check_${this.props.card.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteCardPayload {
        boardColumn { cards },
        deletedCardId,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'boardColumn',
      parentID: this.props.boardColumn.id,
      connectionName: 'cards',
      deletedIDFieldName: 'deletedCardId',
    }];
  }
  getVariables() {
    return {
      cardId: this.props.card.id,
      boardColumnId: this.props.boardColumn.id,
    };
  }
  // This mutation decalres a dependency on the boardColumn to which the card it is being added
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
