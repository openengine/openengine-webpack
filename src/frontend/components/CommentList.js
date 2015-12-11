import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Radium from 'radium';
import Colors from 'material-ui/lib/styles/colors';
import Comment from './Comment';
import {
  TextField,
  Avatar,
} from 'material-ui';
import AddCommentMutation from '../mutations/AddCommentMutation';
const styles = {
  commentsContainer: (commentsOn) => ({
    transition: 'all .4s ease-in-out',
    opacity: commentsOn ? 1 : 0,
    height: commentsOn ? 'auto' : 0,
  }),
  commentListItem: {
    position: 'relative',
    paddingTop: 5,
    paddingBottom: 5,
  },
  addCommentTextBox: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: Colors.grey700,
    marginLeft: 5,
  },
  addCommentHint: {
    fontSize: '0.8rem',
    fontWeight: 400,
    marginLeft: '0.5rem',
  },
  hr: {
    width: '100%',
    borderStyle: 'solid',
    borderColor: Colors.grey200,
    borderWidth: 1,
    borderTopStyle: 'none',
  },
};

function createAvatar(name) {
  let avatar = '?';
  if (name) {
    const splitName = name.split(' ');
    if (splitName.length > 1) {
      avatar = splitName[0][0] + splitName[1][0];
    } else {
      if (splitName.length === 1) {
        avatar = name.substring(0, 2);
      }
    }
  }
  return avatar;
}
@Radium
class CommentList extends React.Component {
  static propTypes = {
    card: PropTypes.object,
    viewer: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.addComment = this.addComment.bind(this);
  }
  addComment() {
    const commentText = this._txtAddComment.getValue();
    if (commentText && commentText.trim()) {
      /* MUTATION: This is where the add comment to card mutation will exist...*/
      Relay.Store.update(
        new AddCommentMutation({
          card: this.props.card,
          text: commentText.trim(),
          postedBy: this.props.viewer,
        })
      );
    }
  }
  render() {
    const { card, viewer } = this.props;
    // Get Avatar Initials of current user for commenting
    const avatar = createAvatar(viewer.name);
    const showComments = card.comments.edges && card.comments.edges.length > 0;
    return (
      <div>
        <div style={styles.commentsContainer(showComments)}>
          <ul style={{listStyleType: 'none', paddingLeft: '0.5rem', marginTop: 10}}>
            {
              card.comments.edges.map(({node}) =>
                <li key={'listComment_' + node.id} style={styles.commentListItem}>
                  <Comment comment={node}/>
               </li>
             )
            }
          </ul>
        </div>
        <hr style={styles.hr} />
        <Avatar size={30} style={{fontSize: '0.8rem'}} color={Colors.grey50} backgroundColor={Colors.greenA700}>{avatar}</Avatar>
        <TextField multiline ref={(ref) => this._txtAddComment = ref} onEnterKeyDown={this.addComment} style={styles.addCommentTextBox}
          hintStyle={styles.addCommentHint} fullWidth hintText="Add comment..." />
      </div>
  );
  }
}
export default Relay.createContainer(CommentList, {
  prepareVariables({}) {
    return {
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991,
    };
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        name
      }
    `,
    card: () => Relay.QL`
      fragment on Card {
        id
        comments(first: $limit) {
          edges {
            node {
              id
              ${Comment.getFragment('comment')}
            }
          }
        }
        ${AddCommentMutation.getFragment('card')}
      }
    `,
  },
});
