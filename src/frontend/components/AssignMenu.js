import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import Relay from 'react-relay';
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
    borderColor: Colors.grey300,
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
class AssignMenu extends React.Component {
  static propTypes = {
    viewer: PropTypes.object,
    card: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.itemSelected = this.itemSelected.bind(this);
    this.setValue = this.setValue.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.openFocus = this.openFocus.bind(this);
    this.assignmentChange = this.assignmentChange.bind(this);
  }
  componentDidMount() {
    // We need to currently set this width in the componentDidMount because material-ui merges the styles attributes
    // for all it's children controls on the AutomComplete, and so we need to set this width to 'auto' to avoid overlapping on the Toolbars...
    findDOMNode(this._autoComplete.refs.searchTextField).style.width = 'auto';
  }
  setValue(value) {
    this._autoComplete.setValue(value);
    const avatar = createAvatar(value);
    this.setState({selectedAvatar: avatar});
  }
  itemSelected(item) {
    if (item.props && item.key) {
      // this.setState({selectedAvatar: item.props.avatar});
        /* MUTATION: This is where the change 'assignment' card mutation will exist... */
    }
  }
  clearValue() {
    this._autoComplete.setValue('');
    this.setState({selectedAvatar: ''});
  }
  openFocus() {
    this._autoComplete.refs.searchTextField.focus();
  }
  assignmentChange() {
    /* MUTATION: This is where the change 'assignment' card mutation will exist... */
    // const card = this.state.card;
    // card.assignedTo = {id: id};
    // this.setState({card: card });
  }
  render() {
    const {viewer, card} = this.props;
    const assignedAvatar = card.assignedTo ? createAvatar(card.assignedTo.name) : '';
    const iconButtonElement = (
      <FlatButton onClick={this.openFocus} style={styles.avatarButton} hoverColor="#ffffff" rippleColor="#ffffff">
        <Avatar size={30} style={styles.avatar} color={Colors.grey50} backgroundColor={assignedAvatar ? Colors.greenA700 : 'transparent'}>
        {assignedAvatar}</Avatar>
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
          updateWhenFocused
          animated={false}
          showAllItems
          style={{fontSize: '0.8rem', paddingTop: 0, marginTop: 0, top: 0}}
          ref={(ref) => this._autoComplete = ref}
          onNewRequest={this.itemSelected}
          dataSource={
            viewer.team.map(user => {
              const avatar = createAvatar(user.name);
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
export default Relay.createContainer(AssignMenu, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        team {
          id
          name
        }
      }
    `,
    card: () => Relay.QL`
      fragment on Card {
        id
        assignedTo {
          id
          name
        }
      }
    `,
  },
});

// <IconButton onClick={this.clearValue} iconStyle={{fontSize: '1.1rem'}} style={{position: 'absolute', top: 0, right: 0}}>
//     <FontIcon color={Colors.blueGrey100} className="material-icons">backspace</FontIcon>
// </IconButton>
