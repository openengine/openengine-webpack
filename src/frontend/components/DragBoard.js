import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Radium from 'radium';
import {
  TextField,
  FontIcon,
  IconButton,
  FlatButton,
  Paper,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import CardList from './CardList';
import AssignMenu from './AssignMenu';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import AddCardMutation from '../mutations/AddCardMutation';

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
    bottom: -248,
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
    transform: isHover ? 'translateY(-258px) translateZ(2px)' : 'translateY(0px) translateZ(2px)',
  }),

  paperAdd: {
    width: '100%',
    minHeight: 200,
    padding: 20,
  },

  addCardNameRow: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    overflow: 'visible',
    width: '100%',
    fontWeight: 300,
    fontSize: '0.6rem',
    color: Colors.grey500,
  },

  addCardName: {
    flex: '0 1 75%',
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
    this.addMouseEnter = this.addMouseEnter.bind(this);
    this.closeAdd = this.closeAdd.bind(this);
    this.createCard = this.createCard.bind(this);
    this.state = {addOpened: false};
  }

  addMouseEnter() {
    this.setState({addOpened: true});
  }

  closeAdd() {
    this.setState({addOpened: false});
  }

  createCard() {
    const { cardLists } = this.props.board;
    // Add card to initial card list...
    Relay.Store.update(
      new AddCardMutation({
        cardList: cardLists.edges[0].node,
        name: this._addCardName.getValue(),
        description: this._addCardDescription.getValue(),
      })
    );
    this.setState({addOpened: false});
  }

  render() {
    const { board } = this.props;
    const { cardLists } = board;
    const { addOpened } = this.state;
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
          <div style={[styles.addCardBack(addOpened)]}>
              <Paper key="addCard" zDepth={1} rounded={false} style={styles.paperAdd}>
                <div style={[styles.columnContainer]}>
                <IconButton onClick={this.closeAdd} style={{position: 'absolute', top: -10, right: -10}}><FontIcon color={Colors.grey300} className="material-icons">close</FontIcon></IconButton>
                  <div style={styles.addCardNameRow}>
                      <TextField ref={(ref) => this._addCardName = ref} style={styles.addCardName} fullWidth hintText="Card Name" />
                      <div style={{textAlign: 'center', position: 'relative', top: 15, flex: '0 1 25%'}}>
                        <div style={{fontSize: '0.8rem', fontWeight: 400, paddingBottom: 5}}> assign to: </div>
                        <AssignMenu users={{}} />
                      </div>
                  </div>
                  <TextField ref={(ref) => this._addCardDescription = ref} fullWidth hintText="Description..." multiLine rows={2} />
                  <div style={{marginTop: 20, textAlign: 'left'}}>
                    <FlatButton onClick={this.createCard} labelStyle={{textAlign: 'left', padding: 0}} label="Create Card" labelPosition="after" secondary> <FontIcon style={{color: 'inherit', padding: 0, verticalAlign: 'middle'}} className="material-icons">done</FontIcon> </FlatButton>
                  </div>
                </div>
              </Paper>
          </div>
        </div>
        <button onMouseEnter={this.addMouseEnter} key="addFloatButton" style={styles.floatingBtn}>
         <div key={1} style={[styles.floatingIcon, styles.pen(isAddHover)]}><FontIcon style={styles.insideIcon} className="material-icons">picture_in_picture</FontIcon></div>
         <div key={2} style={[styles.floatingIcon, styles.plus(isAddHover)]}><FontIcon style={styles.insideIcon} className="material-icons">add</FontIcon></div>
       </button>

      </div>
    );
  }
}
