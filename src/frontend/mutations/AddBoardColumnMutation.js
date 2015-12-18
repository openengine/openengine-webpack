import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class AddBoardColumnMutation extends Relay.Mutation {
  static propTypes = {
    board: PropTypes.object,
    name: PropTypes.string,
    rank: PropTypes.number,
  };
  getMutation() {
    // TODO: WORKS????????????
    return Relay.QL`mutation{addBoardColumn}`;
  }
  getCollisionKey() {
    return `boardColumn_${this.props.board.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddBoardColumnPayload {
        newBoardColumnEdge,
        board { columns },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'board',
      parentID: this.props.board.id,
      connectionName: 'columns',
      edgeName: 'newBoardColumnEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      boardId: this.props.board.id,
      name: this.props.name,
      rank: this.props.rank,
    };
  }
  getOptimisticResponse() {
    return {
      board: {
        id: this.props.board.id,
      },
      newBoardColumnEdge: {
        node: {
          name: this.props.name,
          rank: this.props.rank,
        },
      },
    };
  }
  // This mutation decalres a dependency on the boardColumn to which the board it is being added
  static fragments = {
    board: () => Relay.QL`
      fragment on Board {
        id
      }
    `,
  };
}
