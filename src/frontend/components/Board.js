import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import BoardColumn from './BoardColumn';
import Radium from 'radium';
import HTML5Backend from 'react-dnd-html5-backend';
import CardDetails from './CardDetails';
import { DragDropContext } from 'react-dnd';
import {
IconButton,
FontIcon,
Paper,
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
  cardDetailsContainer: (isOpen) => ({
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
    this.closeCardDetails = this.closeCardDetails.bind(this);
    this.setGridView = this.setGridView.bind(this);
    this.setListView = this.setListView.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.state = {cardDetailsOpened: false, gridView: true, detailsCard: null};
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
    // Clear out the old card state first before setting a new card state...
    this.setState({detailsCard: null}, ()=>{
      this.setState({detailsCard: card, cardDetailsOpened: true});
    });
  }
  closeCardDetails() {
    this.setState({cardDetailsOpened: false});
  }
  render() {
    const { board, viewer } = this.props;
    const { columns } = board;
    const { gridView, detailsCard, cardDetailsOpened } = this.state;

    const cardDetails = detailsCard ? (
      <CardDetails card={detailsCard} viewer={viewer} ref={(ref) => this._cardDetails = ref} />
    ) : '';
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
        <Paper style={styles.cardDetailsContainer(cardDetailsOpened)} ref={(ref) => this._details = ref}>
          <IconButton onClick={this.closeCardDetails} style={{position: 'absolute', top: 0, right: 0}}>
            <FontIcon color={Colors.grey300} className="material-icons">close</FontIcon>
          </IconButton>
          {cardDetails}
        </Paper>
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
              ${BoardColumn.getFragment('boardColumn')}
            }
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        id
        ${CardDetails.getFragment('viewer')}
      }
    `,
  },
});
