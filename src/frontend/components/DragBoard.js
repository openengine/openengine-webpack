import React, { PropTypes } from 'react';
import Radium from 'radium';
import {
  TextField,
  FontIcon,
  Paper,
  MenuItem,
  FlatButton,
  IconMenu,
  Avatar,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import CardList from './CardList';
import AssignMenu from './AssignMenu';
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

  floatingBtn: {
    position: 'fixed',
    bottom: 25,
    right: 25,
    backgroundColor: Colors.tealA700,
    width: 60,
    height: 60,
    borderRadius: '50%',
    boxShadow: '2px 2px 7px -1px rgba(0, 0, 0, 0.5)',
    border: 'none',
    outline: 'none',
    transition: '.2s cubic-bezier(.4,0,.2,1)',
    ':hover': {
      cursor: 'pointer',
      boxShadow: '2px 4px 7px 0px rgba(0, 0, 0, 0.6)',
    },
    ':active': {
      backgroundColor: Colors.tealA400,
      boxShadow: '1px 3px 7px 0px rgba(0, 0, 0, 0.6)',
    },
  },
  floatingIcon: {
    position: 'absolute',
    marginLeft: 14,
    marginTop: 14,
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    backgroundSize: 'contain',
    transition: '.2s cubic-bezier(.4,0,.2,1)',
  },
  pen: (isHover) => ({
    opacity: (isHover ? 1 : 0),
    transform: (isHover ? 'rotate(0deg)' : 'rotate(125deg)'),
  }),
  plus: (isHover) => ({
    opacity: (isHover ? 0 : 1),
    transform: (isHover ? 'rotate(-125deg)' : 'rotate(0deg)'),
  }),
  insideIcon: {
    color: '#FFFFFF',
    fontSize: '2.0rem',
  },

  addCardContainer: {
    position: 'fixed',
    bottom: -198,
    right: 100,
    width: 400,
    minHeight: 200,
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
    transition: 'all .4s ease-in-out',
    perspective: 600,
  },

  addCardBack: (isHover) => ({
    backfaceVisibility: 'visible',
    transitionDuration: '.4s',
    backgroundColor: '#555',
    width: '100%',
    transformOrigin: isHover ? '50px 0' : '0',
    transform: 'rotateX(180deg) translateY(-198px) translateZ(2px)',
  }),

  paperAdd: {
    width: '100%',
    minHeight: 200,
    padding: 20,
  },

  swing: {
    transform: 'rotateX(0deg) translateY(-198px) translateZ(2px)',
  },
};


// Right... so we need to seperate out this component because the Drag and Drop context will only work with the default exported class...
// And therefore, a Relay Container (as far as I know), will not work directly with React Dnd...
@DragDropContext(HTML5Backend)
@Radium
export default class DragBoard extends React.Component {
  static propTypes = {
    board: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.addClick = this.addClick.bind(this);
    this.state = {swinging: false};
  }

  addClick() {
    this.setState({swinging: !this.state.swinging});
  }

  render() {
    const { board } = this.props;
    const { cardLists } = board;
    const isAddHover = Radium.getState(this.state, 'addFloatButton', ':hover');

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
          {cardLists.edges.map(({node}) =>
            <CardList
              key={node.id}
              cardList={node}
            />
          )}
        </div>
        <div style={styles.addCardContainer}>
          <div style={this.state.swinging ? [styles.addCardBack(true), styles.swing] : [styles.addCardBack(isAddHover)]}>
              <Paper key="addCard" zDepth={1} rounded={false} style={styles.paperAdd}>
                    <TextField fullWidth hintText="Card Name" />
                    <TextField fullWidth hintText="Description" multiLine rows={2} />
                    <AssignMenu users={{}} />
              </Paper>
          </div>
        </div>
        <button onClick={this.addClick} key="addFloatButton" style={styles.floatingBtn}>
         <div key={1} style={[styles.floatingIcon, styles.pen(isAddHover)]}><FontIcon style={styles.insideIcon} className="material-icons">picture_in_picture</FontIcon></div>
         <div key={2} style={[styles.floatingIcon, styles.plus(isAddHover)]}><FontIcon style={styles.insideIcon} className="material-icons">add</FontIcon></div>
       </button>

      </div>
    );
  }
}
