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

  rowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    overflow: 'visible',
    width: '100%',
  },

  nameColumn: {
    flex: '0 1 25%',
    fontWeight: 300,
    fontSize: '0.6rem',
    color: Colors.grey500,
  },

  actionColumn: {
    flex: '0 1 75%',
    textAlign: 'left',
  },

  dropdown: {
    fontWeight: 400,
    fontSize: '0.7rem',
    color: Colors.grey600,
  },

  featureName: {
    fontWeight: 300,
    fontSize: '0.7rem',
    color: Colors.grey500,
    marginLeft: '1rem',
    marginTop: '1rem',
    textAlign: 'right',
  },

  featureAction: {
    fontWeight: 400,
    fontSize: '0.7rem',
    color: Colors.grey600,
  },

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
  },

  menu: {
    fontSize: '0.7rem',
    color: Colors.grey600,
  },
};

@Radium
export default class FeatureMenu extends React.Component {
  static propTypes = {
    feature: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }

  render() {
    const { feature } = this.props;

    return (
    <div style={styles.rowContainer}>
      <div style={styles.nameColumn}>
          <h2 style={styles.featureName}>{feature.name} </h2>
      </div>
      <div style={styles.actionColumn}>
          <IconMenu menuStyle={styles.menu} iconButtonElement={<FlatButton style={styles.avatarButton} hoverColor="#ffffff" rippleColor="#ffffff"><Avatar size={25} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>DB</Avatar>&nbsp;Dave Bryand<FontIcon style={styles.dropIcon} className="material-icons">arrow_drop_down</FontIcon></FlatButton>}>
            <MenuItem index={0}><Avatar size={25} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>DB</Avatar>&nbsp; Dave Bryand</MenuItem>
            <MenuItem index={1}><Avatar size={25} style={styles.avatar} color={Colors.grey50} backgroundColor={Colors.greenA700}>LE</Avatar>&nbsp; Luis Escobedo</MenuItem>
          </IconMenu>
      </div>
    </div>
    );
  }
}
