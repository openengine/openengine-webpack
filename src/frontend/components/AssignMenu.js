import React, { PropTypes } from 'react';
import Radium from 'radium';
import {
  FlatButton,
  IconMenu,
  FontIcon,
  Avatar,
  AutoComplete,
} from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Colors from 'material-ui/lib/styles/colors';
const styles = {
  avatar: {
    fontSize: '0.8rem',
    fontWeight: 300,
    borderColor: Colors.grey400,
    borderStyle: 'solid',
    borderWidth: 1,
    verticalAlign: 'middle',
  },
  dropIcon: {
    verticalAlign: 'middle',
    color: '#fff',
  },
  avatarButton: {
    fontSize: '0.7rem',
    color: Colors.grey600,
    textTransform: 'none',
    textAlign: 'left',
    verticalAlign: 'middle',
    minWidth: 0,
    display: 'inline-block',
    marginRight: 5,
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
    this.state = {selectedAvatar: '', selectedItem: ''};
  }
  getSelected() {
    return this.state.selectedItem;
  }
  itemSelected(event, item) {
    this.setState({selectedAvatar: item.props.avatar, selectedItem: item.props.value});
  }
  clearValue() {
    this.setState({selectedAvatar: '', selectedItem: ''});
  }
  render() {
    const {selectedAvatar} = this.state;
    const {users} = this.props;
    const iconButtonElement = (
      <FlatButton style={styles.avatarButton} hoverColor="#ffffff" rippleColor="#ffffff">
        <Avatar size={30} style={styles.avatar} color={Colors.grey50} backgroundColor="#ffffff">
        {selectedAvatar}</Avatar>
      </FlatButton>
    );
    return (
      <div>
        {iconButtonElement}
        <AutoComplete
          fullWidth
          hintText = "Assign To"
          onUpdateInput={(t) => {
            console.log(t);
          }}
          showAllItems
          dataSource={
            users.map(user => {
              let avatar = '?';
              const splitName = user.name.split(' ');
              if (splitName.length > 1) {
                avatar = splitName[0][0] + splitName[1][0];
              } else {
                if (splitName.length === 1) {
                  avatar = user.name.substring(0, 2);
                }
              }
              const compObject = (
                  <AutoComplete.Item index={user.id} key={user.id} avatar={avatar} value={user.name} style={styles.menuItem} >
                    <Avatar size={25} style={styles.avatar} color={Colors.grey50}
                    backgroundColor={Colors.greenA700}>{avatar}
                    </Avatar>&nbsp;{user.name}
                  </AutoComplete.Item>
              );
              return compObject;
            }).reduce((p, c) => {p[c.props.value] = c; return p;}, {})
          }
          filter={(searchText, key) => {
            return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
          }}
          onNewRequest={(t, index) => {console.log('request:' + index);}} />
      </div>
  );
  }
}

// filter={(searchText, key) => {
//   return key.indexOf(searchText) !== -1;
// }}
// filter={(searchText, key) => {
//   return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
// }}
 // .reduce((p, c, i) => {p[i] = c; return p;}, {})
  // <IconMenu openDirection="bottom-left" style={{verticalAlign: 'middle'}} onItemTouchTap={this.itemSelected}
  // iconButtonElement={iconButtonElement}>
  //   {users.map(user => {
  //     let avatar = '?';
  //     const splitName = user.name.split(' ');
  //     if (splitName.length > 1) {
  //       avatar = splitName[0][0] + splitName[1][0];
  //     } else {
  //       if (splitName.length === 1) {
  //         avatar = user.name.substring(0, 2);
  //       }
  //     }
  //     return (
  //       <MenuItem index={user.id} key={user.id} avatar={avatar} value={user.id} style={styles.menuItem} >
  //         <Avatar size={25} style={styles.avatar} color={Colors.grey50}
  //         backgroundColor={Colors.greenA700}>{avatar}
  //         </Avatar>&nbsp;{user.name}
  //       </MenuItem>
  //     );
  //   })
  //   }
  // </IconMenu>

      //   {
      //      a:(<AutoComplete.Item primaryText={'a'} secondaryText="&#9786;" />),
      //      divider:(<AutoComplete.Divider/>),
      //      b:(<AutoComplete.Item primaryText={'b'} secondaryText="&#9885;" />),
      // }
