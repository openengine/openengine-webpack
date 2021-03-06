import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Radium from 'radium';
import EditableTextField from './EditableTextField';
import Colors from 'material-ui/lib/styles/colors';
import moment from 'moment';
import UpdateCommentMutation from '../mutations/UpdateCommentMutation';
import {
  Avatar,
} from 'material-ui';
const styles = {
  commentSingleContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
  },
  commentDataContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: '1 1 auto',
    width: '100%',
    marginLeft: 5,
  },
  commentTxt: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: Colors.grey700,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  commentPostedBy: {
    fontSize: '0.9rem',
    fontWeight: 400,
    color: Colors.grey700,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  commentDate: {
    fontSize: '0.7rem',
    fontWeight: 400,
    color: Colors.grey500,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
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
class Comment extends React.Component {
  static propTypes = {
    comment: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.updateComment = this.updateComment.bind(this);
  }
  updateComment() {
    /* MUTATION: This is where the update 'comment' mutation will exist... for updating a comment's text*/
    Relay.Store.update(
      new UpdateCommentMutation({
        comment: this.props.comment,
        text: this._comment.getValue(),
      })
    );
  }
  render() {
    const { comment } = this.props;

    // Get Avatar Initials of comment
    const commentAvatar = createAvatar(comment.postedBy.name);
    return (
      <div style={styles.commentSingleContainer}>
          <Avatar size={30} style={{fontSize: '0.8rem', flex: '0 0 auto'}} color={Colors.grey50} backgroundColor={Colors.greenA700}>{commentAvatar}</Avatar>
          <div style={styles.commentDataContainer}>
            <div>
              <div style={[styles.commentPostedBy, {display: 'inline-block'}]}>{comment.postedBy.name}</div>
              <div style={[styles.commentDate, {display: 'inline-block', marginLeft: 10}]}>{moment(comment.postedOn).calendar(null, {
                sameDay: '[Today] [at] h:mm a',
                nextDay: '[Tomorrow] [at] h:mm a',
                nextWeek: 'dddd [at] h:mm a',
                lastDay: '[Yesterday] [at] h:mm a',
                lastWeek: '[Last] dddd [at] h:mm a',
                sameElse: 'ddd, MMM Do YYYY, [at] h:mm a',
              })}
             </div>
            </div>
            <EditableTextField multiLine style={{position: 'relative'}} underlineStyle={{borderColor: 'transparent'}}
              txtStyle={styles.commentTxt} value={comment.text} ref={(ref) => this._comment = ref} hintText="Say what?"
              text={comment.text} onSave={this.updateComment} />
          </div>
      </div>
  );
  }
}
export default Relay.createContainer(Comment, {
  fragments: {
    comment: () => Relay.QL`
      fragment on Comment {
        id
        text
        postedOn
        postedBy {
          name
        }
        ${UpdateCommentMutation.getFragment('comment')}
      }
    `,
  },
});
