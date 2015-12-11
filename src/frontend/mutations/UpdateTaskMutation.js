import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class UpdateTaskMutation extends Relay.Mutation {
  static propTypes = {
    task: PropTypes.object,
  };
  getMutation() {
    return Relay.QL`mutation{updateTask}`;
  }
  getCollisionKey() {
    return `update_${this.props.task.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateTaskPayload {
        updatedTask
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        updatedTask: this.props.task.id,
      },
    },
  ];
  }
  getVariables() {
    return {
      id: this.props.task.id,
      name: this.props.name,
      status: this.props.status,
    };
  }
  // Let's craft an optimistic response that mimics the shape of the
  // SaveTaskPayload, as well as the values we expect to receive.
  getOptimisticResponse() {
    return {
      updatedTask: {
        id: this.props.task.id,
        name: this.props.name,
        status: this.props.status,
      },
    };
  }
  // This mutation decalres a dependency on the boardColumn to which the task is being moved (if any),
  // as well as the task's id and the id of the boardColumn to which it belongs.
  static fragments = {
    task: () => Relay.QL`
      fragment on Task {
        id
      }
    `,
  };
}
