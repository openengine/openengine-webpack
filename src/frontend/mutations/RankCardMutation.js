import Relay from 'react-relay';

export default class RankCardMutation extends Relay.Mutation {
  // This mutation decalres a dependency on the card's id and the id of the cardList to which it belongs,
  // and it's new rank within the cardList
  static fragments = {
    card: () => Relay.QL`
      fragment on Card {
        id,
        cardList { id }
      }
    `,
    toRank: () => Relay.QL`
      fragment on Card {
        rank
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{moveCard}`;
  }
  getCollisionKey() {
    return `check_${this.props.card.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RankCardPayload {
        card {
          rank,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        card: this.props.card.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.card.id,
      toCardListId: this.props.card.cardList.id,
      toRank: this.props.toRank.rank,
    };
  }
  getOptimisticResponse() {
    return {
      card: {
        id: this.props.card.id,
      },
    };
  }
}
