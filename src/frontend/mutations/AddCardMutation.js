import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class AddCardMutation extends Relay.Mutation {
  static propTypes = {
    boardColumn: PropTypes.object,
    name: PropTypes.string,
    description: PropTypes.string,
    rank: PropTypes.number,
  };
  getMutation() {
    return Relay.QL`mutation{addCard}`;
  }
  getCollisionKey() {
    return `check_${this.props.boardColumn.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddCardPayload {
        boardColumn,
        newCardEdge,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'boardColumn',
      parentID: this.props.boardColumn.id,
      connectionName: 'cards',
      edgeName: 'newCardEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      boardColumnId: this.props.boardColumn.id,
      name: this.props.name,
      description: this.props.description,
      rank: this.props.rank,
    };
  }
  // This mutation decalres a dependency on the boardColumn to which the card it is being added
  static fragments = {
    boardColumn: () => Relay.QL`
      fragment on BoardColumn {
        id
      }
    `,
  };
}
