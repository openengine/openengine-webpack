import React, { PropTypes } from 'react';
import Radium from 'radium';
import {
  FlatButton,
  IconMenu,
  FontIcon,
  Avatar,
} from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Colors from 'material-ui/lib/styles/colors';
const styles = {
  avatar: {
    fontSize: '0.8rem',
    fontWeight: 300,
  },

  dropIcon: {
    verticalAlign: 'middle',
    color: '#fff',
  },

  avatarButton: {
    fontSize: '0.7rem',
    color: Colors.grey600,
    textTransform: 'none',
    textAlign: 'center',
  },

  menuItem: {
    color: Colors.grey600,
    fontSize: '0.8rem',
    textAlign: 'left',
  },
};
@Radium
export default class AssignMenu extends React.Component {
  static propTypes = {
    users: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.itemSelected = this.itemSelected.bind(this);
    this.getSelected = this.getSelected.bind(this);
    this.state = {selectedAvatar: (<FontIcon style={styles.dropIcon} className="material-icons">arrow_drop_down</FontIcon>), selectedItem: ''};
  }
  getSelected() {
    return this.state.selectedItem;
  }
  itemSelected(event, item) {
    this.setState({selectedAvatar: item.props.avatar, selectedItem: item.props.value});
  }
  clearValue() {
    this.setState({selectedAvatar: (<FontIcon style={styles.dropIcon} className="material-icons">arrow_drop_down</FontIcon>), selectedItem: ''});
  }
  render() {
    const {selectedAvatar} = this.state;
    const {users} = this.props;
    return (
      <IconMenu onItemTouchTap={this.itemSelected} iconButtonElement={<FlatButton style={styles.avatarButton} hoverColor="#ffffff" rippleColor="#ffffff"><Avatar size={40} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>{selectedAvatar}</Avatar></FlatButton>}>
        {users.map(user => {
          let avatar = '?';
          const splitName = user.name.split(' ');
          if (splitName.length > 1) {
            avatar = splitName[0][0] + splitName[1][0];
          } else {
            if (splitName.length === 1) {
              avatar = user.name.substring(0, 2);
            }
          }
          return (
            <MenuItem key={user.id} avatar={avatar} value={user.id} style={styles.menuItem} >
            <Avatar size={25} style={styles.avatar} color={Colors.grey50}
            backgroundColor={Colors.greenA700}>{avatar}
            </Avatar>&nbsp;{user.name}</MenuItem>
          );
        })
        }
      </IconMenu>
    );
  }
}
