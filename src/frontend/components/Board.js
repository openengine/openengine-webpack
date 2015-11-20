import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import BoardColumn from './BoardColumn';
import Radium from 'radium';
import AddCardMutation from '../mutations/AddCardMutation';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import CardSave from './CardSave';
import SpinButton from './SpinButton';
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
  spinBtn: {
    position: 'fixed',
    bottom: 25,
    right: 25,
  },
  addCardContainer: {
    position: 'fixed',
    bottom: -248,
    right: 100,
    width: 400,
    minHeight: 200,
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
    transition: 'all .4s ease-in-out',
    perspective: 600,
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
    this.toggleCard = this.toggleCard.bind(this);
    this.setGridView = this.setGridView.bind(this);
    this.setListView = this.setListView.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.addCardMouseEnter = this.addCardMouseEnter.bind(this);
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
  toggleCard(toggle) {
    this.setState({addOpened: toggle});
  }
  addCardMouseEnter() {
    this.toggleCard(true);
  }
  render() {
    const { board, viewer } = this.props;
    const { columns } = board;
    const { addOpened, gridView } = this.state;
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
              viewType={gridView ? 'grid' : 'list'}
            />
          )}
        </div>
        <div style={styles.addCardContainer}>
          <CardSave users={viewer.users} toggleCard={this.toggleCard} opened={addOpened} boardColumn={columns.edges[0].node} />
        </div>
        <SpinButton btnStyle={styles.spinBtn} mouseEnter={this.addCardMouseEnter} />
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
        users {
          id
          name
        }
      }
    `,
  },
});
