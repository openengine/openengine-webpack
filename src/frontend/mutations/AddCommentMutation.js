import Relay from 'react-relay';
import moment from 'moment';
import {
  PropTypes,
} from 'react';
export default class AddCommentMutation extends Relay.Mutation {
  static propTypes = {
    card: PropTypes.object,
    text: PropTypes.string,
    postedBy: PropTypes.object,
  };
  getMutation() {
    return Relay.QL`mutation{addComment}`;
  }
  getCollisionKey() {
    return `comment_${this.props.card.id}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddCommentPayload {
        newCommentEdge,
        card { comments },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'card',
      parentID: this.props.card.id,
      connectionName: 'comments',
      edgeName: 'newCommentEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  getVariables() {
    return {
      cardId: this.props.card.id,
      text: this.props.text,
    };
  }
  getOptimisticResponse() {
    return {
      card: {
        id: this.props.card.id,
      },
      newCommentEdge: {
        node: {
          text: this.props.text,
          postedBy: this.props.postedBy,
          postedOn: moment().toISOString(),
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
