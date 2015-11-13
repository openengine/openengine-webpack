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
    users: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.itemSelected = this.itemSelected.bind(this);
    this.state = {selectedAvatar: (<FontIcon style={styles.dropIcon} className="material-icons">arrow_drop_down</FontIcon>)};
  }

  itemSelected(event, item) {
    this.setState({selectedAvatar: item.props.value});
  }

  render() {
    const {selectedAvatar} = this.state;
    return (
      <IconMenu onItemTouchTap={this.itemSelected} iconButtonElement={<FlatButton style={styles.avatarButton} hoverColor="#ffffff" rippleColor="#ffffff"><Avatar size={40} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>{selectedAvatar}</Avatar></FlatButton>}>
        <MenuItem value="DB" style={styles.menuItem} index={0}><Avatar size={25} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>DB</Avatar>&nbsp;Dave Bryand</MenuItem>
        <MenuItem value="LE" style={styles.menuItem} index={1}><Avatar size={25} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>LE</Avatar>&nbsp;Luis Escobedo</MenuItem>
      </IconMenu>
    );
  }
}
