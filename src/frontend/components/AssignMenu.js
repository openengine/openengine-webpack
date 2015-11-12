import React, { PropTypes } from 'react';
import Radium from 'radium';
import {
  MenuItem,
  FlatButton,
  IconMenu,
  FontIcon,
  Avatar,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';

const styles = {

  avatar: {
    fontSize: '0.8rem',
    fontWeight: 300,
  },

  dropIcon: {
    verticalAlign: 'middle',
  },

  avatarButton: {
    fontSize: '0.7rem',
    color: Colors.grey600,
    textTransform: 'none',
    paddingLeft: '1rem',
    textAlign: 'left',
  },

  menu: {
    fontSize: '0.7rem',
    color: Colors.grey600,
  },
};

@Radium
export default class AssignMenu extends React.Component {
  static propTypes = {
    users: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <IconMenu menuStyle={styles.menu} iconButtonElement={<FlatButton style={styles.avatarButton} hoverColor="#ffffff" rippleColor="#ffffff"><Avatar size={25} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>DB</Avatar>&nbsp;Dave Bryand<FontIcon style={styles.dropIcon} className="material-icons">arrow_drop_down</FontIcon></FlatButton>}>
        <MenuItem index={0}><Avatar size={25} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>DB</Avatar>&nbsp; Dave Bryand</MenuItem>
        <MenuItem index={1}><Avatar size={25} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>LE</Avatar>&nbsp; Luis Escobedo</MenuItem>
      </IconMenu>
    );
  }
}
