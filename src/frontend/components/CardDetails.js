import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Radium from 'radium';
import {
  FontIcon,
  Toolbar,
  ToolbarGroup,
  FlatButton,
  DatePicker,
} from 'material-ui';
import AssignMenu from './AssignMenu';
import EditableTextField from './EditableTextField';
import Colors from 'material-ui/lib/styles/colors';
import moment from 'moment';
import RemoveCardMutation from '../mutations/RemoveCardMutation';
import UpdateCardMutation from '../mutations/UpdateCardMutation';
import CommentList from './CommentList';
import TaskList from './TaskList';
const styles = {
  subHeader: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: Colors.grey700,
    textAlign: 'left',
  },
  cardName: {
    marginTop: '1.5rem',
    marginLeft: '0.2rem',
    marginRight: '2.0rem',
    marginBottom: '0.5rem',
    position: 'relative',
  },
  cardNameTxt: {
    fontSize: '1.0rem',
    fontWeight: 400,
    color: Colors.grey700,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  toolbar: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'visible',
    width: '100%',
    backgroundColor: '#ffffff',
    paddingLeft: 0,
  },
  dateBtn: {
    height: 'auto',
    display: 'inline-block',
    margin: 0,
    minWidth: 0,
  },
  dateBtnLbl: (isOpen) => ({
    fontSize: '0.8rem',
    fontWeight: 400,
    color: isOpen ? Colors.grey800 : Colors.grey400,
    textAlign: 'left',
    verticalAlign: 'middle',
    paddingLeft: 0,
    marginLeft: 0,
    paddingRight: 0,
    textTransform: 'none',
  }),
  dateBtnIcon: (isOpen) => ({
    verticalAlign: 'middle',
    fontSize: '1.4rem',
    top: -2,
    color: isOpen ? Colors.grey800 : Colors.grey400,
  }),
  icons: {
    color: Colors.grey400,
    lineHeight: '36px',
    float: 'none',
    paddingLeft: 15,
  },
  description: {
    borderColor: Colors.grey200,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
  },
  descriptionHint: {
    top: '1rem',
    left: '0.5rem',
  },
};
@Radium
class CardDetails extends React.Component {
  static propTypes = {
    boardColumn: PropTypes.object,
    card: PropTypes.object,
    viewer: PropTypes.object,
    toggleCard: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.updateCardCore = this. updateCardCore.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);
    this.dueDateChange = this.dueDateChange.bind(this);
    this.state = {dateOpen: false};
  }
  updateCardCore() {
    /* MUTATION: This is where the update card mutation will exist... for updating core attributes like name, description, etc.*/
    if (this._cardName) {
      Relay.Store.update(
        new UpdateCardMutation({
          card: this.props.card,
          name: this._cardName.getValue(),
          description: this._cardDescription.getValue(),
          dueDate: moment(this._datePicker).toISOString(),
        })
      );
    }
  }
  toggleDatePicker() {
    // Need to reach into the control and set off the DatePicker window's 'close' event
    if (!this.state.dateOpen) {
      this._datePicker.openDialog();
      this.setState({dateOpen: true });
    } else {
      this._datePicker.refs.dialogWindow.dismiss();
      this.setState({dateOpen: false });
    }
  }
  dueDateChange() {
    // Mutate Card on changing the due date
    this.updateCardCore();
    this.setState({dateOpen: false });
  }
  render() {
    const { dateOpen} = this.state;
    const { card, viewer } = this.props;
    const showComments = (card && card.comments && card.comments.length);
    const cardDateCal = card.dueDate ? moment(card.dueDate).calendar(null, {
      sameDay: '[Due Today]',
      nextDay: '[Due Tomorrow]',
      nextWeek: '[Due] dddd',
      lastDay: '[Due Yesterday]',
      lastWeek: '[Due Last] dddd',
      sameElse: '[Due] MMM Do',
    }) : '';
    const cardDate = card.dueDate ? moment(card.dueDate).toDate() : new Date();

    return (
      <div>
        <EditableTextField multiLine txtStyle={styles.cardNameTxt} value={card.name} underlineStyle={{borderColor: Colors.grey300}}
          style={styles.cardName} ref={(ref) => this._cardName = ref} hintText="Card name" text={card.name}
          onSave={this.updateCardCore} uniqueKey={'cardName'} />
        <Toolbar style={styles.toolbar}>
          <ToolbarGroup key={0} style={{flex: '0 1 auto'}}>
            <AssignMenu ref={(ref) => this._assignMenu = ref} viewer={viewer} card={card} />
          </ToolbarGroup>
          <ToolbarGroup key={1} style={{flex: '1 0 auto', paddingTop: 5}}>
            <FlatButton onTouchTap={this.toggleDatePicker} style={styles.dateBtn} hoverColor={'tranparent'}
              labelStyle={styles.dateBtnLbl(dateOpen)} label={cardDateCal} labelPosition="after">
              <FontIcon style={styles.dateBtnIcon(dateOpen)} hoverColor={Colors.grey800} className="material-icons">today</FontIcon>
            </FlatButton>
            <FontIcon style={styles.icons} className="material-icons">attach_file</FontIcon>
            <FontIcon style={styles.icons} className="material-icons">delete</FontIcon>
          </ToolbarGroup>
        </Toolbar>
        <DatePicker ref={(ref) => this._datePicker = ref} defaultDate={cardDate} autoOk container="inline"
          onChange={this.dueDateChange} textFieldStyle={{opacity: 0, height: 0, position: 'absolute'}} />
        <EditableTextField multiLine style={styles.description} underlineStyle={{borderColor: 'transparent'}}
          hintStyle={styles.descriptionHint} txtStyle={{paddingLeft: 5}} value={card.description}
          ref={(ref) => this._cardDescription = ref} hintText="Description goes here..." text={card.description} tabIndex={2}
          rows={3} onSave={this.updateCardCore} uniqueKey={'cardtDescription'} />
        <h2 style={[{marginTop: '1.5rem'}, styles.subHeader]}>Tasks</h2>
        <TaskList card={card} />
        <h2 style={[styles.subHeader, {opacity: showComments ? 1 : 0}]}>Comments</h2>
        <CommentList card={card} viewer={viewer} />
      </div>
    );
  }
}
export default Relay.createContainer(CardDetails, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        name
        team {
          id
          name
        }
        ${CommentList.getFragment('viewer')}
        ${AssignMenu.getFragment('viewer')}
      }
    `,
    card: () => Relay.QL`
      fragment on Card {
        id
        name
        description
        dueDate
        ${TaskList.getFragment('card')}
        ${CommentList.getFragment('card')}
        ${AssignMenu.getFragment('card')}
        ${RemoveCardMutation.getFragment('card')}
        ${UpdateCardMutation.getFragment('card')}
      }
    `,
  },
});
