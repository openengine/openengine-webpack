import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import BoardColumn from './BoardColumn';
import Radium from 'radium';
import HTML5Backend from 'react-dnd-html5-backend';
import CardDetails from './CardDetails';
import { DragDropContext } from 'react-dnd';
import {
IconButton,
FlatButton,
FontIcon,
Paper,
TextField,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import AddBoardColumnMutation from '../mutations/AddBoardColumnMutation';
const styles = {
  container: {
    fontFamily: 'Roboto, sans-serif',
    background: '#fff',
    overflow: 'auto',
  },
  rowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'auto',
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
  boardColumnAdd: (viewType) => ({
    flex: '1 0 auto',
    paddingTop: 10,
    paddingBottom: 10,
    height: 'auto',
    alignSelf: viewType === 'grid' ? 'flex-start' : 'stretch',
    margin: '0.3rem',
    backgroundColor: Colors.grey100,
    borderRadius: 5,
  }),
  addColumnBtn: (opened)=>({
    opacity: opened ? 1 : 0,
    height: opened ? 'auto' : 0,
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    backgroundColor: 'transparent',
    verticalAlign: 'middle',
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  }),
  addColumnBtnIcon: {
    verticalAlign: 'middle',
    left: '1.0rem',
    fontSize: '1.0rem',
    color: Colors.grey400,
  },
  addColumnBtnLabel: {
    color: Colors.grey400,
    fontSize: '0.9rem',
    fontWeight: 400,
    verticalAlign: 'middle',
    textTransform: 'none',
    textAlign: 'center',
  },
  addColumnTmp: (viewType, opened)=>({
    textAlign: 'center',
    opacity: opened ? 1 : 0,
    height: opened ? 'auto' : 0,
    borderRadius: 0,
    marginBottom: (viewType === 'grid' && opened) ? '0.5rem' : '0.2rem',
    marginRight: '0.5rem',
    marginLeft: '0.5rem',
    minHeight: (viewType === 'grid' && opened) ? 0 : 0,
    padding: (viewType === 'grid' && opened) ? '0px 5px 0px 5px' : '0px 5px 0px 5px',
  }),
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
// Used to sort columns in a board by the specified field
const sortColumns = (board, sortBy) => {
  return board.columns ? board.columns.edges.map(({node}) => node).sort((columnA, columnB) => {
    if (columnA[sortBy] >= columnB[sortBy]) {
      return 1;
    }
    if (columnA[sortBy] < columnB[sortBy]) {
      return -1;
    }
  }) : [];
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
    this.addColumnInit = this.addColumnInit.bind(this);
    this.addColumn = this.addColumn.bind(this);
    this.addColumnBlur = this.addColumnBlur.bind(this);
    this.state = {cardDetailsOpened: false, gridView: true, addColumnOpened: false, detailsCard: null};
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
  addColumnInit() {
    this.setState({addColumnOpened: true});
    this._addColumnName.focus();
  }
  addColumnBlur() {
    this.setState({addColumnOpened: false});
  }
  addColumn() {
    const columnName = this._addColumnName.getValue().trim();
    if (columnName) {
      this.setState({addColumnOpened: false});
      const { board } = this.props;
      const columns = sortColumns(board, 'rank');
      let rank = 0;
      if (columns.length > 0) {
        rank = columns[columns.length - 1].rank + 1;
      }
      // Add board column
      Relay.Store.update(
        new AddBoardColumnMutation({
          board: board,
          name: this._addColumnName.getValue(),
          rank: rank,
        })
      );
      this._addColumnName.clearValue();
      this._addColumnName.blur();
    }
  }
  render() {
    const { board, viewer } = this.props;
    const { columns } = board;
    const { gridView, detailsCard, cardDetailsOpened, addColumnOpened } = this.state;
    const viewType = gridView ? 'grid' : 'list';

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
              viewType={viewType}
            />
          )}
          <div style={styles.boardColumnAdd(viewType)}>
            <Paper style={styles.addColumnTmp(viewType, addColumnOpened)} zDepth={0}>
              <TextField inputStyle={{textAlign: 'center'}} onEnterKeyDown={this.addColumn} onBlur={this.addColumnBlur} ref={(ref) => this._addColumnName = ref} underlineStyle={{borderColor: 'transparent'}}
              underlineFocusStyle={{borderColor: 'transparent'}} hintText= "New List Name ..."
              fullWidth />
            </Paper>
            <FlatButton onClick={this.addColumnInit} fullWidth style={styles.addColumnBtn(!addColumnOpened)} labelStyle={styles.addColumnBtnLabel}
            label="New List" labelPosition="after"><FontIcon style={styles.addColumnBtnIcon} className="material-icons">add</FontIcon></FlatButton>
          </div>
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
      limit: 100,
    };
  },

  fragments: {
    board: () => Relay.QL`
      fragment on Board {
        name
        ${AddBoardColumnMutation.getFragment('board')},
        columns(first: $limit) {
          edges {
            node {
              id
              rank
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
