import Relay from 'react-relay';

export default class AddCardMutation extends Relay.Mutation {
  // This mutation decalres a dependency on the cardList to which the card is being moved (if any),
  // as well as the card's id and the id of the cardList to which it belongs.
  static fragments = {
    cardList: () => Relay.QL`
      fragment on CardList {
        id
      }
    `,
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
      name: this.props.name,
      description: this.props.description,
    };
  }
  // getOptimisticResponse() {
  //   return {
  //     cardList: {
  //       id: this.props.cardList.id,
  //     },
  //   };
  // }
}
