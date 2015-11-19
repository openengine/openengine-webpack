import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class MoveCardMutation extends Relay.Mutation {
  static propTypes = {
    card: PropTypes.object,
    fromBoardColumn: PropTypes.object,
    toBoardColumn: PropTypes.object,
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
        fromBoardColumn,
        toBoardColumn,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        fromBoardColumn: this.props.fromBoardColumn.id,
        toBoardColumn: this.props.toBoardColumn.id,
      },
    },
  ];
  }
  getVariables() {
    return {
      cardId: this.props.card.id,
      fromBoardColumnId: this.props.fromBoardColumn.id,
      toBoardColumnId: this.props.toBoardColumn.id,
      toRank: this.props.toRank,
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
    fromBoardColumn: () => Relay.QL`
      fragment on BoardColumn {
        id
      }
    `,
    toBoardColumn: () => Relay.QL`
      fragment on BoardColumn {
        id
      }
    `,
  };
}
