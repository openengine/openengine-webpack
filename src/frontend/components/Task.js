import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Radium from 'radium';
import EditableTextField from './EditableTextField';
import Colors from 'material-ui/lib/styles/colors';
import {
  Checkbox,
} from 'material-ui';
const styles = {
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
};
@Radium
class Task extends React.Component {
  static propTypes = {
    task: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.saveTask = this.saveTask.bind(this);
  }
  saveTask() {
    /* MUTATION: This is where the update 'task' mutation will exist... for updating a tasks text*/
  }
  taskChecked(event, checked) {
    /* MUTATION: This is where the change 'task' status card mutation will exist... */
    // const card = this.state.card;
    // const index = card.tasks.findIndex((tsk)=>{ return tsk.id === task.id;});
    // card.tasks[index].status = checked ? 'closed' : 'open';
    // this.setState({card: card });
  }
  render() {
    const { task } = this.props;
    return (
      <div style={styles.taskSingleContainer}>
        <div style={styles.taskCheckbox(task.status === 'closed')} key={'checkTask_' + task.id}>
          <Checkbox onCheck={this.taskChecked} checked={task.status === 'closed'} iconStyle={{paddingRight: 0, marginRight: 5}} />
        </div>
        <EditableTextField uniqueKey={'textTask_' + task.id} underlineStyle={{borderColor: 'transparent', bottom: 3}} underlineFocusStyle={{bottom: 3}}
          txtContainerStyle={{height: 'auto'}} txtStyle={styles.taskTxt(task.status === 'closed')} value={task.description}
          style={{position: 'relative', flex: '1 1 auto'}} ref={(ref) => this._task = ref}
          hintText="What's the task?" hintStyle={{bottom: 0, fontSize: '0.8rem'}} text={task.description} onSave={this.saveTask} />
      </div>
  );
  }
}
export default Relay.createContainer(Task, {
  fragments: {
    task: () => Relay.QL`
      fragment on Task {
        id
        description
        status
      }
    `,
  },
});
