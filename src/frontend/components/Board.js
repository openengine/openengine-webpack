import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import BoardColumn from './BoardColumn';
import Radium from 'radium';
import HTML5Backend from 'react-dnd-html5-backend';
import CardDetails from './CardDetails';
import { DragDropContext } from 'react-dnd';
import {
IconButton,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
const styles = {
  container: {
    fontFamily: 'Roboto, sans-serif',
    background: '#fff',
  },
  rowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
    padding: 3,
    minHeight: 500,
  },
  columnContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: '100%',
  },
  viewIcon: (isActive) => ({
    color: isActive ? Colors.grey800 : Colors.grey400,
  }),
  boardHeader: {
    flex: '1 0 auto',
    fontSize: '1.0rem',
    fontWeight: 100,
    color: '#9E9E9E',
  },
  boardName: {
    fontSize: '1.5rem',
    fontWeight: 100,
    color: '#9E9E9E',
    marginBottom: 40,
  },
};
@Radium
class Board extends React.Component {
  static propTypes = {
    board: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.toggleCardDetails = this.toggleCardDetails.bind(this);
    this.setGridView = this.setGridView.bind(this);
    this.setListView = this.setListView.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.state = {addOpened: false, gridView: true};
  }
  setGridView() {
    this.toggleView(true);
  }
  setListView() {
    this.toggleView(false);
  }
  toggleView(isGridView) {
    this.setState({gridView: isGridView});
  }
  toggleCardDetails(card) {
    card.tasks = [{id: card.id + '_task1', text: 'task 1', status: 'open'}, {id: card.id + '_task2', text: 'task 2', status: 'closed'}, {id: card.id + '_task3', text: 'task 3', status: 'open'}];
    card.comments = [{id: card.id + '_comment1', postedBy: 'Luis E', text: 'Nice.', createdAt: '2015-11-29T13:15:30Z'}, {id: card.id + '_comment4', postedBy: 'Luis E', text: 'Another one.', createdAt: '2015-09-29T15:15:30Z'}, {id: card.id + '_comment3', postedBy: 'Luis E', createdAt: '2015-12-03T18:37:30Z', text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magn.'}, {id: card.id + '_comment2', createdAt: '2015-12-04T09:15:30Z', postedBy: 'Luis E', text: 'I like this comment?'}];
    card.dueDate = '2015-12-25';
    card.assignedTo = {id: 'user1', name: 'Luis Escobedo'};
    this.setState({detailsCard: card});
    this._cardDetails.openCardDetails(card);
  }
  render() {
    const { board, viewer } = this.props;
    const { columns } = board;
    const { gridView, detailsCard } = this.state;
    const team = [{name:'Luis Escobedo', id: 'user1'}, {name:'Dave Bryand', id: 'user2'}];
    return (
      <div style={[styles.container]}>
        <IconButton onClick={this.setGridView} iconStyle={styles.viewIcon(gridView)} iconClassName="material-icons" tooltipPosition="bottom-center"
        tooltip="grid view">apps</IconButton>
       <IconButton onClick={this.setListView} iconStyle={styles.viewIcon(!gridView)} iconClassName="material-icons" tooltipPosition="bottom-center"
        tooltip="list view">menu</IconButton>
        <div style={gridView ? styles.rowContainer : styles.columnContainer}>
          {columns.edges.map(({node}) =>
            <BoardColumn
              key={node.id}
              boardColumn={node}
              toggleCardDetails = {this.toggleCardDetails}
              viewType={gridView ? 'grid' : 'list'}
            />
          )}
        </div>
       <CardDetails team={team} currentUser={viewer.name} card={detailsCard} ref={(ref) => this._cardDetails = ref} />
      </div>
    );
  }
}

// Wrap the board with the Drag n' Drop Context
const DragBoard = DragDropContext(HTML5Backend)(Board);

export default Relay.createContainer(DragBoard, {
  prepareVariables({}) {
    return {
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991,
    };
  },

  fragments: {
    board: () => Relay.QL`
      fragment on Board {
        name
        columns(first: $limit) {
          edges {
            node {
              id
              ${BoardColumn.getFragment('boardColumn')},
            }
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        name,
      }
    `,
  },
});
