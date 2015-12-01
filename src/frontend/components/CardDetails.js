import React, { PropTypes } from 'react';
import Radium from 'radium';
import {
  IconButton,
  FontIcon,
  Toolbar,
  ToolbarGroup,
  Paper,
  TextField,
  FlatButton,
  RaisedButton,
  Checkbox,
  List,
} from 'material-ui';
import AssignMenu from './AssignMenu';
import Colors from 'material-ui/lib/styles/colors';
import ListItem from 'material-ui/lib/lists/list-item';
const styles = {
  container: (isOpen) => ({
    width: 'auto',
    padding: 10,
    whiteSpace: 'nowrap',
    overflow: 'visible',
    transition: 'all .4s ease-in-out',
    position: 'fixed',
    right: 0,
    top: 0,
    zIndex: 5,
    maxWidth: '50%',
    transform: isOpen ? 'translateX(-1%) translateZ(0px)' : 'translateX(100%) translateZ(0px)',
  }),
  cardName: {
    fontSize: '1.0rem',
    fontWeight: 400,
    color: Colors.grey700,
    textAlign: 'left',
    marginLeft: '0.2rem',
    marginRight: '2.0rem',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  nameTextBox: {
    fontSize: '1.0rem',
    fontWeight: 400,
    color: Colors.grey700,
    textAlign: 'left',
    marginLeft: '0.2rem',
    marginRight: '2.0rem',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
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
  inputStyle: (isFocus) => ({
    cursor: isFocus ? 'text' : 'url(/img/ic_edit_black_18px.svg), auto',
  }),
  tasksHeader: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: Colors.grey700,
    textAlign: 'left',
  },
  addTaskBtn: (tasksOn) => ({
    transition: 'all .5s ease-in-out',
    opacity: tasksOn ? 0 : 1,
    height: tasksOn ? 0 : 'auto',
  }),
  addTaskBtnLbl: {
    fontSize: '0.7rem',
    fontWeight: 400,
    color: Colors.grey300,
    textAlign: 'left',
    verticalAlign: 'middle',
    paddingLeft: 0,
    marginLeft: 3,
    textTransform: 'none',
  },
  tasksContainer: (tasksOn) => ({
    transition: 'all .4s ease-in-out',
    opacity: tasksOn ? 1 : 0,
    height: tasksOn ? 'auto' : 0,
    borderColor: Colors.grey200,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
  }),
  taskTextBox: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: Colors.grey700,
    display: 'block',
  },
  taskHint: {
    fontSize: '0.8rem',
    fontWeight: 400,
    marginLeft: '0.5rem',
  },
  taskListItem: {
    fontSize: '0.8rem',
    fontWeight: 400,
    paddingLeft: '3rem',
    color: Colors.grey500,
  },
  hr: {
    width: '100%',
    borderStyle: 'solid',
    borderColor: Colors.grey200,
    borderWidth: 1,
    borderTopStyle: 'none',
  },
  assignLbl: {
    fontSize: '0.8rem',
    color: Colors.grey400,
    fontWeight: 400,
    paddingBottom: 5,
    display: 'inline-block',
    marginLeft: 10,
  },
  icons: {
    color: Colors.grey300,
    lineHeight: '36px',
  },
};
@Radium
export default class CardDetails extends React.Component {
  static propTypes = {
    opened: PropTypes.bool,
    boardColumn: PropTypes.object,
    card: PropTypes.object,
    toggleCard: PropTypes.func,
    users: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.toggleCardDetails = this.toggleCardDetails.bind(this);
    this.openCardDetails = this.openCardDetails.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.saveCard = this.saveCard.bind(this);
    this.nameFocus = this.nameFocus.bind(this);
    this.nameBlur = this.nameBlur.bind(this);
    this.addTaskBlur = this.addTaskBlur.bind(this);
    this.showAddTaskClick = this.showAddTaskClick.bind(this);
    this.addTaskClick = this.addTaskClick.bind(this);
    this.state = {opened: false, nameFocus: false, addTask: false, numTasks: 0, cardDetails: { name: '', description: ''}};
  }
  saveCard() {
  }
  openCardDetails(card) {
    this.setState({nameFocus: false, cardDetails: {name: card.name, description: card.description}});
    this._cardName.setValue(card.name);
    if (card.description) {
      this._cardDescription.setValue(card.description);
    }
    if (!this.state.opened) {
      this.toggleCardDetails();
    }
  }
  toggleCardDetails() {
  //  this._details.toggle();
    this.setState({opened: !this.state.opened});
  }
  nameChange(event) {
    this.setState({cardDetails: {name: event.target.value}});
  }
  nameFocus() {
    this.setState({nameFocus: true});
  }
  nameBlur() {
    this.setState({nameFocus: false});
  }
  showAddTaskClick() {
    this._addTask.focus();
    this.setState({addTask: true});
  }
  addTaskClick() {
    this.setState({addTask: false});
  }
  addTaskBlur() {
    this.setState({addTask: false});
  }
  render() {
    const { opened, nameFocus, addTask, numTasks } = this.state;
    const { card, users } = this.props;
    return (
      <Paper style={styles.container(opened)} ref={(ref) => this._details = ref}>
        <IconButton onClick={this.toggleCardDetails} style={{position: 'absolute', top: 0, right: 0}}>
          <FontIcon color={Colors.grey300} className="material-icons">close</FontIcon>
        </IconButton>
        <h1 style={[styles.cardName, {visibility: 'hidden', top: 0, height: 0}]}>{card ? card.name : ''} </h1>
        <TextField tabIndex={1} ref={(ref) => this._cardName = ref} onFocus={this.nameFocus} onBlur={this.nameBlur} onChange={this.nameChange} underlineStyle={ {borderColor: Colors.grey200 }} style={styles.nameTextBox} inputStyle={styles.inputStyle(nameFocus)} fullWidth hintText="Card Name" />
        <Toolbar style={{backgroundColor: '#ffffff', paddingLeft: 0, overflow: 'visible'}}>
          <ToolbarGroup key={0} float="left">
            <AssignMenu ref={(ref) => this._assignMenu = ref} users={users} />
            <div style={styles.assignLbl}>Assign to</div>
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FontIcon style={styles.icons} className="material-icons">today</FontIcon>
            <FontIcon style={styles.icons} className="material-icons">attach_file</FontIcon>
            <FontIcon style={styles.icons} className="material-icons">delete</FontIcon>
          </ToolbarGroup>
        </Toolbar>
        <TextField tabIndex={2} ref={(ref) => this._cardDescription = ref} hintStyle={styles.descriptionHint} underlineStyle={ {borderColor: 'transparent' }} style={styles.description} inputStyle={{padding: 5}} fullWidth hintText="Description goes here..." multiLine rows={4} />
        <h2 style={styles.tasksHeader}>Tasks</h2>
        <div style={styles.tasksContainer(addTask || (card && card.tasks && card.tasks.length))}>
          <List>
            <ListItem primaryText="Inbox" style={styles.taskListItem} leftCheckbox={<Checkbox />} />
            <ListItem primaryText="Starred" style={styles.taskListItem}  leftCheckbox={<Checkbox />} />
            <ListItem primaryText="Sent mail" style={styles.taskListItem}  leftCheckbox={<Checkbox />} />
            <ListItem primaryText="Drafts" style={styles.taskListItem}  leftCheckbox={<Checkbox />} />
          </List>
          <TextField ref={(ref) => this._addTask = ref} onBlur={this.addTaskBlur} style={styles.taskTextBox} hintStyle={styles.taskHint} fullWidth hintText="What's next?" />
          <RaisedButton onClick={this.addTaskClick} labelStyle={{textTransform: 'none'}} label="Add" secondary={true} />
        </div>
        <FlatButton onClick={this.showAddTaskClick} style={styles.addTaskBtn(addTask)} hoverColor="transparent" labelStyle={styles.addTaskBtnLbl} label="Add Task" labelPosition="after">
          <FontIcon style={{verticalAlign: 'middle', fontSize: '0.8rem', top: -2}} color={Colors.grey300} className="material-icons">add</FontIcon>
        </FlatButton>
        <hr style={styles.hr} />
       </Paper>
    );
  }
}
