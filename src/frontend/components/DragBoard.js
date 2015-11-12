import React, { PropTypes } from 'react';
import Radium from 'radium';
import {
  TextField,
  FontIcon,
  FloatingActionButton,
  Dialog,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import CardList from './CardList';
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

  floatingAdd: {
    position: 'fixed',
    bottom: 25,
    right: 25,
    transition: '.2s cubic-bezier(.4,0,.2,1)',
    ':hover': {
      cursor: 'pointer',
      boxShadow: '2px 4px 7px 0px rgba(0, 0, 0, 0.6)',
    },
    ':active': {
      backgroundColor: '#C93B2E',
      boxShadow: '1px 3px 7px 0px rgba(0, 0, 0, 0.6)',
    },
  },

  btn: {
    margin: 30,
    backgroundColor: '#db4437',
    position: 'relative',
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
      backgroundColor: '#C93B2E',
      boxShadow: '1px 3px 7px 0px rgba(0, 0, 0, 0.6)',
    },
  },
  icon: {
    position: 'absolute',
    marginLeft: 15,
    marginTop: 15,
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    backgroundSize: 'contain',
    transition: '.2s cubic-bezier(.4,0,.2,1)',
  },
  pen: (isHover) => ({
    backgroundImage: 'url("https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/2x/bt_compose2_2x.png")',
    opacity: (isHover ? 1 : 0),
    transform: (isHover ? 'rotate(0deg)' : 'rotate(125deg)'),
  }),
  plus: (isHover) => ({
    backgroundImage: 'url("https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/2x/bt_speed_dial_2x.png")',
    opacity: (isHover ? 0 : 1),
    transform: (isHover ? 'rotate(-125deg)' : 'rotate(0deg)'),
  }),
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
  }

  render() {
    const { board } = this.props;
    const { cardLists } = board;
    const isAddHover = Radium.getState(this.state, 'addCardButton', ':hover');

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
        <button key="addCardButton" style={styles.btn}>
         <div key={1} style={[styles.icon, styles.pen(isAddHover)]}></div>
         <div key={2} style={[styles.icon, styles.plus(isAddHover)]}></div>
       </button>
        <FloatingActionButton backgroundColor={Colors.tealA700} style={styles.floatingAdd}>
          <FontIcon className="material-icons">add</FontIcon>
        </FloatingActionButton>
      </div>
    );
  }
}
