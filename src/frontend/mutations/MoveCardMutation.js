import Relay from 'react-relay';

export default class MoveCardMutation extends Relay.Mutation {
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
    return Relay.QL`mutation{moveCard}`;
  }
  getCollisionKey() {
    return `check_${this.props.cardList.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on MoveCardPayload {
        cardList
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cardList: this.props.cardList.id,
      },
    },
  ];
  }
  // {
  //   type: 'RANGE_DELETE',
  //   parentName: 'fromCardList',
  //   parentID: this.props.card.cardList.id,
  //   connectionName: 'cards',
  //   deletedIDFieldName: 'removedCardIDs',
  // },
  // ,
  // {
  //   type: 'RANGE_ADD',
  //   parentName: 'toCardList',
  //   parentID: this.props.toCardList.id,
  //   connectionName: 'cards',
  //   edgeName: 'newCardEdge',
  //   rangeBehaviors: {
  //     // When the cards connection is not under the influence
  //     // of any call, append the ship to the end of the connection
  //     '': 'append',
  //   },
  // },

  getVariables() {
    return {
      id: this.props.cardId,
      toCardListId: this.props.cardList.id,
      toRank: this.props.toRank,
    };
  }
  getOptimisticResponse() {
    return {
      cardList: {
        id: this.props.cardList.id,
      },
    };
  }
}
