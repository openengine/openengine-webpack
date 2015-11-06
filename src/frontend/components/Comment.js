import React from 'react';
import Radium from 'radium';
import { IconButton, FontIcon, ListItem, ListDivider, Avatar} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
const styles = {
  listItem: {
    fontWeight: 300,
    fontSize: '0.8rem',
    color: Colors.grey600,
    lineHeight: '1.0rem',
  },
  avatar: {
    fontSize: '0.9rem',
  },

  chatIcon: {
    color: Colors.purple200,
    fontSize: '1.7rem',
  },

  chatIconText: {
    fontWeight: 500,
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.9rem',
    color: Colors.purple200,
    position: 'relative',
    left: -5,
    top: -8,
  },

  commentFull: {
    overflow: 'visible',
    height: 'auto',
    display: 'block',
  },

  commentMin: {
    overflow: 'hidden',
    height: 'auto',
    display: 'box',
  },

};

@Radium
export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.commentClick = this.commentClick.bind(this);
    this.commentExpandClick = this.commentExpandClick.bind(this);
    this.state = {expanded: false, commentFull: false};
  }
  commentExpandClick(event) {
    // We reach into the ListItem component and toggle the nested items... there was no easier way to do this with customized icons
    this._listItem1._handleNestedListToggle(event);
    this.setState({expanded: !this.state.expanded});
  }
  commentClick() {
    // On clicking the comment, toggle it to show/hide the full text.
    this.setState({commentFull: !this.state.commentFull});
  }

  render() {
    const {commentFull, expanded} = this.state;

    return (
  	<div>
  		<ListItem
  		ref={(ref) => this._listItem1 = ref}
  		style={styles.listItem}
  		onTouchTap = {this.commentClick}
  		rightIconButton = {<IconButton onTouchTap={this.commentExpandClick} iconStyle={styles.chatIcon} tooltip="show/hide comments" tooltipPosition="bottom-left">
  		<FontIcon className="material-icons">{expanded ? 'more_vert' : 'more_horiz'}<span style={styles.chatIconText}>&nbsp;4</span></FontIcon>
  		</IconButton>}
  		leftAvatar={<Avatar size={30} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>DB</Avatar>}
  		secondaryText={
  			<p ref={(ref) => this._commentText = ref} style={commentFull ? styles.commentFull : styles.commentMin}>
  			I like this reference to cards being able to rollup to their parents. I think we really need to explore that idea more in the future.
  			</p>
  		}
  		secondaryTextLines={2}
  		nestedItems={[
    <ListItem
  			style={styles.listItem}
  			leftAvatar={<Avatar size={30} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.purple200}>LE</Avatar>}
  			secondaryText={
  				<p>
  				Sounds like a good idea. We should work on that this week.
  				</p>
  			}
  			secondaryTextLines={2} />,
  			]} />
  			<ListDivider inset />
          </div>

      );
  }
}
