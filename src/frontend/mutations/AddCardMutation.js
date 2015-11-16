import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class AddCardMutation extends Relay.Mutation {
  static propTypes = {
    cardList: PropTypes.object,
    userId: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  };
  getMutation() {
    return Relay.QL`mutation{addCard}`;
  }
  getCollisionKey() {
    return `check_${this.props.cardList.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddCardPayload {
        cardList,
        newCardEdge,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'cardList',
      parentID: this.props.cardList.id,
      connectionName: 'cards',
      edgeName: 'newCardEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      cardListId: this.props.cardList.id,
      userId: this.props.userId,
      name: this.props.name,
      description: this.props.description,
    };
  }
  // This mutation decalres a dependency on the cardList to which the card it is being added
  static fragments = {
    cardList: () => Relay.QL`
      fragment on CardList {
        id
      }
    `,
  };
}
