import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Radium from 'radium';
import {
  FlatButton,
  TextField,
  FontIcon,
  Paper,
  IconButton,
} from 'material-ui';
import AssignMenu from './AssignMenu';
import Colors from 'material-ui/lib/styles/colors';
import AddCardMutation from '../mutations/AddCardMutation';
const styles = {
  columnContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  addCardBack: (isHover) => ({
    backfaceVisibility: 'visible',
    transitionDuration: '.4s',
    backgroundColor: '#555',
    width: '100%',
    transform: isHover ? 'translateY(-258px) translateZ(2px)' : 'translateY(0px) translateZ(2px)',
  }),

  paperAdd: {
    width: '100%',
    minHeight: 200,
    padding: 20,
  },

  addCardNameRow: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    overflow: 'visible',
    width: '100%',
    fontWeight: 300,
    fontSize: '0.6rem',
    color: Colors.grey500,
  },

  addCardName: {
    flex: '0 1 75%',
  },
};
@Radium
export default class CardSave extends React.Component {
  static propTypes = {
    opened: PropTypes.bool,
    cardList: PropTypes.object,
    toggleCard: PropTypes.func,
    users: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.closeAdd = this.closeAdd.bind(this);
    this.createCard = this.createCard.bind(this);
  }
  closeAdd() {
    this.props.toggleCard(false);
  }
  createCard() {
    const { cardList } = this.props;
    const assignee = this._assignMenu.getSelected();

    // Add card to initial card list...
    Relay.Store.update(
      new AddCardMutation({
        cardList: cardList,
        userId: assignee,
        name: this._addCardName.getValue(),
        description: this._addCardDescription.getValue(),
      })
    );
    this.props.toggleCard(false);
    this._addCardName.clearValue();
    this._addCardDescription.clearValue();
    this._assignMenu.clearValue();
  }
  render() {
    const{ opened, users } = this.props;
    return (
      <div style={[styles.addCardBack(opened)]}>
        <Paper key="addCard" zDepth={1} rounded={false} style={styles.paperAdd}>
          <div style={[styles.columnContainer]}>
            <IconButton onClick={this.closeAdd} style={{position: 'absolute', top: -10, right: -10}}><FontIcon color={Colors.grey300} className="material-icons">close</FontIcon></IconButton>
            <div style={styles.addCardNameRow}>
              <TextField tabIndex={1} ref={(ref) => this._addCardName = ref} style={styles.addCardName} fullWidth hintText="Card Name" />
              <div style={{textAlign: 'center', position: 'relative', top: 15, flex: '0 1 25%'}}>
                <div style={{fontSize: '0.8rem', fontWeight: 400, paddingBottom: 5}}> assign to: </div>
                <AssignMenu ref={(ref) => this._assignMenu = ref} users={users} />
              </div>
            </div>
            <TextField tabIndex={2} ref={(ref) => this._addCardDescription = ref} fullWidth hintText="Description..." multiLine rows={2} />
            <div style={{marginTop: 20, textAlign: 'left'}}>
              <FlatButton tabIndex={3} onClick={this.createCard} labelStyle={{textAlign: 'left', padding: 0}} label="Create Card" labelPosition="after" secondary> <FontIcon style={{color: 'inherit', padding: 0, verticalAlign: 'middle'}} className="material-icons">done</FontIcon> </FlatButton>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}
