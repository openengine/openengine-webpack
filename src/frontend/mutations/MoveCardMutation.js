import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class MoveCardMutation extends Relay.Mutation {
  static propTypes = {
    card: PropTypes.object,
    fromCardList: PropTypes.object,
    toCardList: PropTypes.object,
    toRank: PropTypes.string,
  };
  getMutation() {
    return Relay.QL`mutation{moveCard}`;
  }
  getCollisionKey() {
    return `check_${this.props.card.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on MoveCardPayload {
        fromCardList,
        toCardList,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        fromCardList: this.props.fromCardList.id,
        toCardList: this.props.toCardList.id,
      },
    },
  ];
  }
  getVariables() {
    return {
      cardId: this.props.card.id,
      fromCardListId: this.props.fromCardList.id,
      toCardListId: this.props.toCardList.id,
      toRank: this.props.toRank,
    };
  }
  // This mutation decalres a dependency on the cardList to which the card is being moved (if any),
  // as well as the card's id and the id of the cardList to which it belongs.
  static fragments = {
    card: () => Relay.QL`
      fragment on Card {
        id
      }
    `,
    fromCardList: () => Relay.QL`
      fragment on CardList {
        id
      }
    `,
    toCardList: () => Relay.QL`
      fragment on CardList {
        id
      }
    `,
  };
}
