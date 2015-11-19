import React, { PropTypes } from 'react';
import Radium from 'radium';
import {
  TextField,
} from 'material-ui';
import BoardColumn from './BoardColumn';
import CardSave from './CardSave';
import SpinButton from './SpinButton';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
const styles = {
  container: {
    fontFamily: 'Roboto, sans-serif',
    background: '#fff',
  },

  rowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
    padding: 3,
    minHeight: 500,
  },

  headerRowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
    padding: 3,
  },

  columnContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  boardHeader: {
    flex: '1 0 auto',
    fontSize: '1.0rem',
    fontWeight: 100,
    color: '#9E9E9E',
  },

  boardSearchbox: {
    paddingTop: '20px',
  },

  boardNmae: {
    fontSize: '1.5rem',
    fontWeight: 100,
    color: '#9E9E9E',
    marginBottom: 40,
  },

  boardSearchIcon: {
    position: 'relative',
    bottom: -5,
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
// Right... so we need to seperate out this component because the Drag and Drop context will only work with the default exported class...
// And therefore, a Relay Container (as far as I know), will not work directly with React Dnd...
@DragDropContext(HTML5Backend)
@Radium
export default class DragBoard extends React.Component {
  static propTypes = {
    board: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.toggleCard = this.toggleCard.bind(this);
    this.addCardMouseEnter = this.addCardMouseEnter.bind(this);
    this.state = {addOpened: false};
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
    const { addOpened } = this.state;
    return (
      <div style={[styles.container]}>
        <div style={[styles.columnContainer]}>
          <div style={[styles.headerRowContainer]}>
            <div style={[styles.boardHeader]}>
              <h2 style={[styles.boardName]}>{board.name}</h2>
            </div>
            <div style={[styles.boardHeader, styles.boardSearchbox]}>
              <TextField
                hintText={<span><i style={[styles.boardSearchIcon]}
                className="material-icons">search</i>Search...</span>}
                hintStyle={{paddingBottom: 5}}
                type="search"
              />
            </div>
          </div>
        </div>
        <div style={[styles.rowContainer]}>
          {columns.edges.map(({node}) =>
            <BoardColumn
              key={node.id}
              boardColumn={node}
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
