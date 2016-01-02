import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Radium from 'radium';
import Colors from 'material-ui/lib/styles/colors';
import Task from './Task';
import {
  TextField,
  FlatButton,
  RaisedButton,
  FontIcon,
} from 'material-ui';
import AddTaskMutation from '../mutations/AddTaskMutation';
const styles = {
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
};
@Radium
class TaskList extends React.Component {
  static propTypes = {
    card: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.addTaskBlur = this.addTaskBlur.bind(this);
    this.showAddTask = this.showAddTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.state = {addTaskOpened: false};
  }
  showAddTask() {
    this._addTask.focus();
    this.setState({addTaskOpened: true});
  }
  addTask() {
    const taskText = this._addTask.getValue();
    if (taskText && taskText.trim()) {
      /* MUTATION: This is where the add task card mutation will exist... for adding tasks to a card */
      Relay.Store.update(
        new AddTaskMutation({
          card: this.props.card,
          name: taskText.trim(),
        })
      );
      this._addTask.clearValue();
    }
    this.setState({addTaskOpened: false});
  }
  addTaskBlur(event) {
    if (!event.relatedTarget || event.relatedTarget.id !== 'addTaskBtn') {
      this.setState({addTaskOpened: false});
    }
  }
  render() {
    const { card } = this.props;
    const { addTaskOpened } = this.state;
    // Get Avatar Initials of current user for tasking
    const showTasks = card.tasks.edges && card.tasks.edges.length > 0;
    return (
      <div>
        <div style={styles.tasksContainer(showTasks)}>
          <ul style={{listStyleType: 'none', paddingLeft: '0.5rem', marginTop: 10}}>
            {
              card.tasks.edges.map(({node}) =>
                <li key={'listTask_' + node.id} style={styles.taskListItem}>
                  <Task task={node}/>
               </li>
             )
            }
          </ul>
          <div style={styles.addTaskContainer(addTaskOpened)}>
            <TextField ref={(ref) => this._addTask = ref} onEnterKeyDown={this.addTask} onBlur={this.addTaskBlur}
            style={styles.addTaskTextBox} hintStyle={styles.addTaskHint} fullWidth hintText="What's next?" />
          </div>
        </div>
        <FlatButton onTouchTap={this.showAddTask} style={styles.addTaskBtn(addTaskOpened)} hoverColor="transparent"
        labelStyle={styles.addTaskBtnLbl} label="Add Task" labelPosition="after">
          <FontIcon style={{verticalAlign: 'middle', fontSize: '0.8rem', top: -2}} color={Colors.grey400} className="material-icons">add</FontIcon>
        </FlatButton>
      </div>
    );
  }
}
export default Relay.createContainer(TaskList, {
  prepareVariables({}) {
    return {
      limit: 100,
    };
  },
  fragments: {
    card: () => Relay.QL`
      fragment on Card {
        id
        tasks(first: $limit) {
          edges {
            node {
              id
              ${Task.getFragment('task')}
            }
          }
        }
        ${AddTaskMutation.getFragment('card')}
      }
    `,
  },
});
