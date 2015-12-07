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
  DatePicker,
} from 'material-ui';
import AssignMenu from './AssignMenu';
import EditableTextField from './EditableTextField';
import Colors from 'material-ui/lib/styles/colors';
import moment from 'moment';
const styles = {
  container: (isOpen) => ({
    width: 'auto',
    padding: 10,
    whiteSpace: 'nowrap',
    overflowY: 'scroll',
    overflowX: 'visible',
    transition: 'all .4s ease-in-out',
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 5,
    maxWidth: '33%',
    transform: isOpen ? 'translateX(-1%) translateZ(0px)' : 'translateX(100%) translateZ(0px)',
  }),
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
  tasksContainer: (tasksOn) => ({
    transition: 'all .4s ease-in-out',
    opacity: tasksOn ? 1 : 0,
    height: tasksOn ? 'auto' : 0,
    borderColor: Colors.grey200,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
  }),
  taskListItem: {
    position: 'relative',
    paddingTop: 5,
    paddingBottom: 5,
  },
  taskSingleContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
  },
  taskTxt: (isClosed) => ({
    fontSize: '0.8rem',
    fontWeight: 400,
    color: isClosed ? Colors.grey400 : Colors.grey700,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    textDecoration: isClosed ? 'line-through' : 'none',
  }),
  taskCheckbox: (isChecked)=> ({
    flex: '0 0 auto',
    verticalAlign: 'top',
    cursor: 'pointer',
    position: 'relative',
    display: 'block',
    ':hover': {
      background: !isChecked ? 'url(/img/ic_done_black_18px.svg) no-repeat 3px 2px' : '',
    },
  }),
  addTaskContainer: (tasksOn) => ({
    transition: 'all .4s ease-in-out',
    opacity: tasksOn ? 1 : 0,
    height: tasksOn ? 'auto' : 0,
    paddingLeft: 10,
  }),
  addTaskBtn: (tasksOn) => ({
    transition: 'all .5s ease-in-out',
    opacity: tasksOn ? 0 : 1,
    height: tasksOn ? 0 : 'auto',
  }),
  addTaskBtnLbl: {
    fontSize: '0.7rem',
    fontWeight: 400,
    color: Colors.grey400,
    textAlign: 'left',
    verticalAlign: 'middle',
    paddingLeft: 0,
    marginLeft: 3,
    textTransform: 'none',
  },
  addTaskTextBox: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: Colors.grey700,
    display: 'block',
  },
  addTaskHint: {
    fontSize: '0.8rem',
    fontWeight: 400,
    marginLeft: '0.5rem',
  },
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
  commentListItem: {
    position: 'relative',
    paddingTop: 5,
    paddingBottom: 5,
  },
  commentSingleContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
  },
  commentDataContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: '1 1 auto',
    width: '100%',
    marginLeft: 5,
  },
  commentTxt: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: Colors.grey700,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  commentPostedBy: {
    fontSize: '0.9rem',
    fontWeight: 400,
    color: Colors.grey700,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  commentDate: {
    fontSize: '0.7rem',
    fontWeight: 400,
    color: Colors.grey500,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  addCommentTextBox: {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: Colors.grey700,
    marginLeft: 5,
  },
  addCommentHint: {
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
};
@Radium
export default class CardDetails extends React.Component {
  static propTypes = {
    opened: PropTypes.bool,
    boardColumn: PropTypes.object,
    card: PropTypes.object,
    toggleCard: PropTypes.func,
    team: PropTypes.array,
    currentUser: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.toggleCardDetails = this.toggleCardDetails.bind(this);
    this.openCardDetails = this.openCardDetails.bind(this);
    this.addTaskBlur = this.addTaskBlur.bind(this);
    this.showAddTaskClick = this.showAddTaskClick.bind(this);
    this.addTaskClick = this.addTaskClick.bind(this);
    this.taskChecked = this.taskChecked.bind(this);
    this.saveCard = this.saveCard.bind(this);
    this.saveTask = this.saveTask.bind(this);
    this.addCommentClick = this.addCommentClick.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);
    this.dueDateChange = this.dueDateChange.bind(this);
    this._tasks = {}; // This is to keep a reference to the task edit textBox components
    this._comments = {}; // This is to keep a reference to the comment edit textBox components
    this.state = {opened: false, dateOpen: false, addTask: false, card: null};
  }
  saveCard() {
    /* MUTATION: This is where the update card mutation will exist... for updating core attributes like name, description, etc.*/
    const card = this.state.card;
    card.name = this._cardName.getValue();
    card.description = this._cardDescription.getValue();
    this.setState({card: card });
  }
  saveTask(task) {
    /* MUTATION: This is where the update 'task' mutation will exist... for updating a tasks text*/
    const card = this.state.card;
    const index = card.tasks.findIndex((tsk)=>{ return tsk.id === task.id;});
    const newText = this._tasks[task.id].getValue();
    card.tasks[index].text = newText;
    this.setState({card: card });
  }
  saveComment(comment) {
    /* MUTATION: This is where the update 'task' mutation will exist... for updating a tasks text*/
    const card = this.state.card;
    const index = card.comments.findIndex((cmt)=>{ return cmt.id === comment.id;});
    const newText = this._comments[comment.id].getValue();
    card.comments[index].text = newText;
    this.setState({card: card });
  }
  openCardDetails(card) {
    this.setState({card: card, dateOpen: false});
    this._datePicker.refs.dialogWindow.dismiss();
    this._cardName.setValue(card.name);
    this._cardDescription.setValue('');
    if (card.description) {
      this._cardDescription.setValue(card.description);
    }
    if (card.dueDate) {
      this._datePicker.setDate(moment(card.dueDate).toDate());
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
    if (taskText && taskText.trim()) {
      /* MUTATION: This is where the add task card mutation will exist... for adding tasks to a card */
      const card = this.state.card;
      const numTasks = card.tasks.length + 1;
      const task = {id: card.id + '_task' + numTasks, text: taskText, status: 'open'};
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
  taskChecked(task, event, checked) {
    /* MUTATION: This is where the change 'task' status card mutation will exist... */
    const card = this.state.card;
    const index = card.tasks.findIndex((tsk)=>{ return tsk.id === task.id;});
    card.tasks[index].status = checked ? 'closed' : 'open';
    this.setState({card: card });
  }
  addCommentClick() {
    const commentText = this._addComment.getValue();
    if (commentText && commentText.trim()) {
      /* MUTATION: This is where the add comment to card mutation will exist...*/
      const card = this.state.card;
      const numComments = card.comments.length + 1;
      const comment = {id: card.id + '_comment' + numComments, text: commentText, createdAt: new Date().getTime(), postedBy: this.props.currentUser};
      card.comments.push(comment);
      this._addComment.clearValue();
      this.setState({card: card });
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
  dueDateChange(event, date) {
      /* MUTATION: This is where the change 'due date' card mutation will exist... */
    const card = this.state.card;
    card.dueDate = moment(date).toISOString();
    this.setState({card: card });
    this.setState({dateOpen: false });
  }
  render() {
    const { opened, addTask, card, dateOpen} = this.state;
    const { team, currentUser } = this.props;
    const showTasksContainer = addTask || (card && card.tasks && card.tasks.length);
    const showComments = (card && card.comments && card.comments.length);
    const cardName = card && card.name ? card.name : '';
    const cardDescription = card && card.description ? card.description : '';
    const cardDateCal = card && card.dueDate ? moment(card.dueDate).calendar(null, {
      sameDay: '[Due Today]',
      nextDay: '[Due Tomorrow]',
      nextWeek: '[Due] dddd',
      lastDay: '[Due Yesterday]',
      lastWeek: '[Due Last] dddd',
      sameElse: '[Due] MMM Do',
    }) : '';
    const cardDate = card && card.dueDate ? moment(card.dueDate).toDate() : new Date();

    // Get Avatar Initials to be used
    let avatar = '?';
    if (currentUser) {
      const splitName = currentUser.split(' ');
      if (splitName.length > 1) {
        avatar = splitName[0][0] + splitName[1][0];
      } else {
        if (splitName.length === 1) {
          avatar = currentUser.substring(0, 2);
        }
      }
    }
    // Create TaskList
    let taskList = '';
    if (card && card.tasks) {
      taskList = (card.tasks.map((task, index) =>
        <li key={'list_' + task.id} style={styles.taskListItem}>
        <div style={styles.taskSingleContainer}>
          <div style={styles.taskCheckbox(task.status === 'closed')} key={'checkTask_' + index}>
            <Checkbox onCheck={this.taskChecked.bind(null, task)} checked={task.status === 'closed'} iconStyle={{paddingRight: 0, marginRight: 5}} />
          </div>
          <EditableTextField uniqueKey={'textTask_' + index} underlineStyle={{borderColor: 'transparent', bottom: 3}} underlineFocusStyle={{bottom: 3}}
            txtContainerStyle={{height: 'auto'}} txtStyle={styles.taskTxt(task.status === 'closed')} value={task.text}
            style={{position: 'relative', flex: '1 1 auto'}} ref={(ref) => this._tasks[task.id] = ref}
            hintText="What's the task?" hintStyle={{bottom: 0, fontSize: '0.8rem'}} text={task.text} onSave={this.saveTask.bind(null, task)} />
        </div>
       </li>
     ));
    }
    // Create CommentList
    let commentList = '';
    if (card && card.comments) {
      commentList = (card.comments.map((comment) =>{
        let commentAvatar = '?';
        const splitName = comment.postedBy.split(' ');
        if (splitName.length > 1) {
          commentAvatar = splitName[0][0] + splitName[1][0];
        } else {
          if (splitName.length === 1) {
            commentAvatar = comment.postedBy.substring(0, 2);
          }
        }
        return (<li key={'list_' + comment.id} style={styles.commentListItem}>
          <div style={styles.commentSingleContainer}>
              <Avatar size={30} style={{fontSize: '0.8rem', flex: '0 0 auto'}} color={Colors.grey50} backgroundColor={Colors.greenA700}>{commentAvatar}</Avatar>
              <div style={styles.commentDataContainer}>
                <div>
                  <div style={[styles.commentPostedBy, {display: 'inline-block'}]}>{comment.postedBy}</div>
                  <div style={[styles.commentDate, {display: 'inline-block', marginLeft: 10}]}>{moment(comment.createdAt).calendar(null, {
                    sameDay: '[Today] [at] h:mm a',
                    nextDay: '[Tomorrow] [at] h:mm a',
                    nextWeek: 'dddd [at] h:mm a',
                    lastDay: '[Yesterday] [at] h:mm a',
                    lastWeek: '[Last] dddd [at] h:mm a',
                    sameElse: 'ddd, MMM Do YYYY, [at] h:mm a',
                  })}
                 </div>
                </div>
                <EditableTextField multiLine style={{position: 'relative'}} underlineStyle={{borderColor: 'transparent'}}
                  txtStyle={styles.commentTxt} value={comment.text} ref={(ref) => this._comments[comment.id] = ref} hintText="Say what?"
                  text={comment.text} onSave={this.saveComment.bind(null, comment)} />
              </div>
          </div>
       </li>);
      }));
    }
    return (
      <Paper style={styles.container(opened)} ref={(ref) => this._details = ref}>
        <IconButton onClick={this.toggleCardDetails} style={{position: 'absolute', top: 0, right: 0}}>
          <FontIcon color={Colors.grey300} className="material-icons">close</FontIcon>
        </IconButton>
        <EditableTextField multiLine txtStyle={styles.cardNameTxt} value={cardName} underlineStyle={{borderColor: Colors.grey300}}
          style={styles.cardName} ref={(ref) => this._cardName = ref} hintText="Card name" text={cardName}
          onSave={this.saveCard} uniqueKey={'cardName'} />
        <Toolbar style={styles.toolbar}>
          <ToolbarGroup key={0} style={{flex: '0 1 auto'}}>
            <AssignMenu ref={(ref) => this._assignMenu = ref} users={team} />
          </ToolbarGroup>
          <ToolbarGroup key={1} style={{flex: '1 0 auto'}}>
          <FlatButton onTouchTap={this.toggleDatePicker} style={styles.dateBtn} hoverColor={'tranparent'} labelStyle={styles.dateBtnLbl(dateOpen)} label={cardDateCal} labelPosition="after">
            <FontIcon style={styles.dateBtnIcon(dateOpen)} hoverColor={Colors.grey800} className="material-icons">today</FontIcon>
          </FlatButton>
           <FontIcon style={styles.icons} className="material-icons">attach_file</FontIcon>
           <FontIcon style={styles.icons} className="material-icons">delete</FontIcon>
          </ToolbarGroup>
        </Toolbar>
        <DatePicker ref={(ref) => this._datePicker = ref} defaultDate={cardDate} autoOk container="inline" onChange={this.dueDateChange} textFieldStyle={{opacity: 0, height: 0, position: 'absolute'}} />
        <br />
        <EditableTextField multiLine style={styles.description} underlineStyle={{borderColor: 'transparent'}}
          hintStyle={styles.descriptionHint} txtStyle={{paddingLeft: 5}} value={cardDescription}
          ref={(ref) => this._cardDescription = ref} hintText="Description goes here..." text={cardDescription} tabIndex={2}
          rows={4} onSave={this.saveCard} uniqueKey={'cardtDescription'} />
        <h2 style={styles.subHeader}>Tasks</h2>
        <div style={styles.tasksContainer(showTasksContainer)}>
          <ul style={{listStyleType: 'none', paddingLeft: '0.5rem', marginTop: 10}}>
            {taskList}
          </ul>
          <div style={styles.addTaskContainer(addTask)}>
            <TextField ref={(ref) => this._addTask = ref} onEnterKeyDown={this.addTaskClick} onBlur={this.addTaskBlur} style={styles.addTaskTextBox} hintStyle={styles.addTaskHint} fullWidth hintText="What's next?" />
            <RaisedButton id="addTaskBtn" onTouchTap={this.addTaskClick} labelStyle={{textTransform: 'none'}} label="Add" secondary />
          </div>
        </div>
        <FlatButton onTouchTap={this.showAddTaskClick} style={styles.addTaskBtn(addTask)} hoverColor="transparent" labelStyle={styles.addTaskBtnLbl} label="Add Task" labelPosition="after">
          <FontIcon style={{verticalAlign: 'middle', fontSize: '0.8rem', top: -2}} color={Colors.grey400} className="material-icons">add</FontIcon>
        </FlatButton>
        <div style={styles.commentsContainer(showComments)}>
          <h2 style={styles.subHeader}>Comments</h2>
            <ul style={{listStyleType: 'none', paddingLeft: '0.5rem', marginTop: 10}}>
              {commentList}
            </ul>
        </div>
        <hr style={styles.hr} />
          <Avatar size={30} style={{fontSize: '0.8rem'}} color={Colors.grey50} backgroundColor={Colors.greenA700}>{avatar}</Avatar>
          <TextField multiline ref={(ref) => this._addComment = ref} onEnterKeyDown={this.addCommentClick} style={styles.addCommentTextBox} hintStyle={styles.addCommentHint} fullWidth hintText="Add comment..." />
       </Paper>
    );
  }
}
