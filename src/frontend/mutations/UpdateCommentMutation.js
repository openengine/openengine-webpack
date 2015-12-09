import Relay from 'react-relay';
import {
  PropTypes,
} from 'react';
export default class UpdateCommentMutation extends Relay.Mutation {
  static propTypes = {
    comment: PropTypes.object,
  };
  getMutation() {
    return Relay.QL`mutation{updateComment}`;
  }
  getCollisionKey() {
    return `update_${this.props.comment.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateCommentPayload {
        updatedComment
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        updatedComment: this.props.comment.id,
      },
    },
  ];
  }
  getVariables() {
    return {
      id: this.props.comment.id,
      text: this.props.text,
    };
  }
  // Let's craft an optimistic response that mimics the shape of the
  // SaveCommentPayload, as well as the values we expect to receive.
  getOptimisticResponse() {
    return {
      updatedComment: {
        id: this.props.comment.id,
        text: this.props.description,
      },
    };
  }
  // This mutation decalres a dependency on the boardColumn to which the comment is being moved (if any),
  // as well as the comment's id and the id of the boardColumn to which it belongs.
  static fragments = {
    comment: () => Relay.QL`
      fragment on Comment {
        id
      }
    `,
  };
}
