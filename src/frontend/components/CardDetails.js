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
  Avatar,
} from 'material-ui';
import AssignMenu from './AssignMenu';
import EditableTextField from './EditableTextField';
import Colors from 'material-ui/lib/styles/colors';
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
    marginTop: '1.5rem',
    marginLeft: '0.2rem',
    marginRight: '2.0rem',
    marginBottom: '0.5rem',
  },
  cardNameTxt: {
    fontSize: '1.0rem',
    fontWeight: 400,
    color: Colors.grey700,
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
  subHeader: {
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
    paddingTop: 5,
  },
  taskTxt: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: Colors.grey700,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  taskCheckbox: (isChecked)=> ({
    verticalAlign: 'top',
    cursor: 'pointer',
    display: 'inline-block',
    ':hover': {
      background: !isChecked ? 'url(/img/ic_done_black_18px.svg) no-repeat 4px center' : '',
    },
  }),
  addTaskContainer: (tasksOn) => ({
    transition: 'all .4s ease-in-out',
    opacity: tasksOn ? 1 : 0,
    height: tasksOn ? 'auto' : 0,
    paddingLeft: 10,
  }),
  hr: {
    width: '100%',
    borderStyle: 'solid',
    borderColor: Colors.grey200,
    borderWidth: 1,
    borderTopStyle: 'none',
  },
  commentsContainer: (commentsOn) => ({
    transition: 'all .4s ease-in-out',
    opacity: commentsOn ? 1 : 0,
    height: commentsOn ? 'auto' : 0,
  }),
  commentTextBox: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: Colors.grey700,
    marginLeft: 5,
  },
  commentHint: {
    fontSize: '0.8rem',
    fontWeight: 400,
    marginLeft: '0.5rem',
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
    this.saveCard = this.saveCard.bind(this);
    this.addTaskBlur = this.addTaskBlur.bind(this);
    this.showAddTaskClick = this.showAddTaskClick.bind(this);
    this.addTaskClick = this.addTaskClick.bind(this);
    this.taskEdit = this.taskEdit.bind(this);
    this._tasks = {}; // This is to keep a reference to the task edit textBox components
    this.state = {opened: false, nameFocus: false, addTask: false, card: null};
  }
  saveCard() {
  }
  openCardDetails(card) {
    this.setState({nameFocus: false, card: card });
    this._cardName.setValue(card.name);
    if (card.description) {
      this._cardDescription.setValue(card.description);
    }
    if (!this.state.opened) {
      this.toggleCardDetails();
    }
  }
  toggleCardDetails() {
    this.setState({opened: !this.state.opened});
  }
  showAddTaskClick() {
    this._addTask.focus();
    this.setState({addTask: true});
  }
  addTaskClick() {
    const taskText = this._addTask.getValue();
    if (taskText) {
      const task = {text: taskText, status: 'open'};
      const card = this.state.card;
      card.tasks.push(task);
      this._addTask.clearValue();
      this.setState({card: card });
    }
    this.setState({addTask: false});
  }
  addTaskBlur(event) {
    if (!event.relatedTarget || event.relatedTarget.id !== 'addTaskBtn') {
      this.setState({addTask: false});
    }
  }
  taskEdit(event) {
    if (event.target && event.target.type !== 'checkbox') {
    }
  }

  render() {
    const { opened, addTask, card } = this.state;
    const { users } = this.props;
    const showTasksContainer = addTask || (card && card.tasks && card.tasks.length);
    const showComments = (card && card.comments && card.comments.length);
    let cardName = '';
    if (card && card.name) {
      cardName = card.name;
    }
    return (
      <Paper style={styles.container(opened)} ref={(ref) => this._details = ref}>
        <IconButton onClick={this.toggleCardDetails} style={{position: 'absolute', top: 0, right: 0}}>
          <FontIcon color={Colors.grey300} className="material-icons">close</FontIcon>
        </IconButton>
        <EditableTextField txtStyle={styles.cardNameTxt} style={styles.cardName} ref={(ref) => this._cardName = ref} hintText="Card name" saveText="Save" text={cardName} />
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
        <h2 style={styles.subHeader}>Tasks</h2>
        <div style={styles.tasksContainer(showTasksContainer)}>
          <ul style={{listStyleType: 'none', paddingLeft: '0.5rem', marginTop: 10}}>
          { card ? card.tasks.map((task, index) =>
            <li onTouchTap={this.taskEdit} key={task.id} style={styles.taskListItem}>
                <div style={styles.taskCheckbox(false)} key={'checkTask_' + index}><Checkbox iconStyle={{paddingRight: 0, marginRight: 5}} /></div>
                <EditableTextField underlineStyle={{borderColor: 'transparent'}} txtStyle={styles.taskTxt} value={task.text} style={{display: 'inline-block', paddingTop: 0, marginTop: -12, paddingBottom: 0, marginBottom: 0}} ref={(ref) => this._tasks[task.id] = ref} hintText="What's the task?" saveText="Save" text={task.text} />
          </li>
          ) : ' '}
          </ul>
          <div style={styles.addTaskContainer(addTask)}>
            <TextField ref={(ref) => this._addTask = ref} onEnterKeyDown={this.addTaskClick} onBlur={this.addTaskBlur} style={styles.taskTextBox} hintStyle={styles.taskHint} fullWidth hintText="What's next?" />
            <RaisedButton id="addTaskBtn" onTouchTap={this.addTaskClick} labelStyle={{textTransform: 'none'}} label="Add" secondary />
          </div>
        </div>
        <FlatButton onTouchTap={this.showAddTaskClick} style={styles.addTaskBtn(addTask)} hoverColor="transparent" labelStyle={styles.addTaskBtnLbl} label="Add Task" labelPosition="after">
          <FontIcon style={{verticalAlign: 'middle', fontSize: '0.8rem', top: -2}} color={Colors.grey300} className="material-icons">add</FontIcon>
        </FlatButton>
        <div style={styles.commentsContainer(showComments)}>
          <h2 style={styles.subHeader}>Comments</h2>
        </div>
        <hr style={styles.hr} />
        <Avatar size={30} style={{fontSize: '0.8rem'}} color={Colors.grey50} backgroundColor={Colors.greenA700}>LE</Avatar>
        <TextField ref={(ref) => this._addComment = ref} style={styles.commentTextBox} hintStyle={styles.commentHint} fullWidth hintText="Add comment..." />
       </Paper>
    );
  }
}

// <h1 style={[styles.cardName, {visibility: 'hidden', top: 0, height: 0}]}>{card ? card.name : ''} </h1>
// <TextField tabIndex={1} ref={(ref) => this._cardName = ref} onFocus={this.nameFocus} onBlur={this.nameBlur} onChange={this.nameChange} underlineStyle={ {borderColor: Colors.grey200 }} style={styles.nameTextBox} inputStyle={styles.inputStyle(nameFocus)} fullWidth hintText="Card Name" />
//

// <List touch>
// { card ? card.tasks.map((task, index) =>
//   <ListItem onTouchTap={this.taskEdit} key={'task_' + index} style={styles.taskListItem} leftIcon={<div style={styles.taskCheckbox(false)} key={'checkTask_' + index}><Checkbox /></div>}><div style={{position: 'relative', left: -25}}>{task.text}</div></ListItem>
// ) : ' '}
// </List>
