import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import {
  FlatButton,
  Avatar,
  AutoComplete,
} from 'material-ui';
import { findDOMNode } from 'react-dom';
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
  componentDidMount() {
    // We need to currently set this width in the componentDidMount because material-ui merges the styles attributes
    // for all it's children controls on the AutomComplete, and so we need to set this width to 'auto' to avoid overlapping on the Toolbars...
    findDOMNode(this._autoComplete.refs.searchTextField).style.width = 'auto';
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

    const assignStyle = (
        <Style scopeSelector=".assignAutoComplete"
          rules={{
            hr: {
              borderColor: 'transparent !important',
            },
          }}
        />);
    return (
      <div className="assignAutoComplete">
        {assignStyle}
        {iconButtonElement}
        <AutoComplete
          fullWidth
          hintText = "Assign To"
          animated={false}
          showAllItems
          style={{fontSize: '0.8rem', paddingTop: 0, marginTop: 0, top: 0}}
          ref={(ref) => this._autoComplete = ref}
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
                  <MenuItem index={user.id} key={user.id} avatar={avatar} value={user.name} style={styles.menuItem} >
                    <Avatar size={25} style={styles.avatar} color={Colors.grey50}
                    backgroundColor={Colors.greenA700}>{avatar}
                    </Avatar>&nbsp;{user.name}
                  </MenuItem>
              );
              return compObject;
            }).reduce((p, c) => {p[c.props.value] = c; return p;}, {})
          }
          filter={(searchText, key) => {
            return key.toLowerCase().startsWith(searchText.toLowerCase());
          }}
          />
      </div>
  );
  }
}
