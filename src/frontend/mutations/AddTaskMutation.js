import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class AddTaskMutation extends Relay.Mutation {
  static propTypes = {
    card: PropTypes.object,
    description: PropTypes.string,
  };
  getMutation() {
    return Relay.QL`mutation{addTask}`;
  }
  getCollisionKey() {
    return `task_${this.props.card.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddTaskPayload {
        newTaskEdge,
        card { tasks },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'card',
      parentID: this.props.card.id,
      connectionName: 'tasks',
      edgeName: 'newTaskEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      cardId: this.props.card.id,
      description: this.props.description,
    };
  }
  getOptimisticResponse() {
    return {
      card: {
        id: this.props.card.id,
      },
      newTaskEdge: {
        node: {
          description: this.props.description,
          status: 'open',
        },
      },
    };
  }
  // This mutation decalres a dependency on the boardColumn to which the card it is being added
  static fragments = {
    card: () => Relay.QL`
      fragment on Card {
        id
      }
    `,
  };
}
