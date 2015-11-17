import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class DeleteCardMutation extends Relay.Mutation {
  static propTypes = {
    card: PropTypes.object,
    cardList: PropTypes.object,
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
        cardList { cards },
        deletedCardId,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'cardList',
      parentID: this.props.cardList.id,
      connectionName: 'cards',
      deletedIDFieldName: 'deletedCardId',
    }];
  }
  getVariables() {
    return {
      cardId: this.props.card.id,
      cardListId: this.props.cardList.id,
    };
  }
  // This mutation decalres a dependency on the cardList to which the card it is being added
  static fragments = {
    card: () => Relay.QL`
      fragment on Card {
        id
      }
    `,
    cardList: () => Relay.QL`
      fragment on CardList {
        id
      }
    `,
  };
}
