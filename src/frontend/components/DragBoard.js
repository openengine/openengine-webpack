import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import update from 'react/lib/update';
import Relay from 'react-relay';
import TextField from 'material-ui/lib/text-field'
import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import Card from './BoardCard'
import BoardColumn from "./BoardColumn"
import { DragDropContext } from 'react-dnd';
import { DragItemTypes } from "../constants"
import { DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// Inline JS Styles
const styles = {
    flexContainer: {
      fontFamily: 'Roboto, sans-serif',
      background: '#FFF'
    },

    flexRowContainer: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'stretch',
      overflow: 'hidden',
      width: '100%',
      padding: 3,
      minHeight: 550
    },

    flexHeaderRowContainer: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'stretch',
      overflow: 'hidden',
      width: '100%',
      padding: 3
    },

    flexColumnContainer: {
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
      alignItems: 'stretch'
    },

    flexBoardColumn: {
      width:'33%',
      flex: '1 0 auto',
      boxShadow: '0 0px 2px rgba(0, 0, 0, 0.15)'
    },

    flexBoardHeader: {
      flex: '1 0 auto',
      fontSize:'1.0rem',
      fontWeight:100,
      color: '#9E9E9E'
    },

    flexBoardSearchbox: {
      paddingTop: '20px'
    },

    boardTitle: {
      fontSize: '1.5rem',
      fontWeight:100,
      color: '#9E9E9E',
      marginBottom: 40
    },

    boardSearchIcon: {
      position: 'relative',
      bottom: -5
    }
};


// Right... so we need to seperate out this component because the Drag and Drop context will only work with the default exported class...
// And therefore, a Relay Container (as far as I know), will not work directly with React Dnd...
@DragDropContext(HTML5Backend)
@Radium
export default class DragBoard extends React.Component {
  
  constructor(props) {
      super(props);
      this.moveCard = this.moveCard.bind(this);
      this.findCard = this.findCard.bind(this);
      const {board} = this.props;
      this.state = {
        cards: {
          todo: Array.from(board.cards.edges, ed => ed.node),
          doing: [],
          done: []
        } 
      };
    }

   moveCard(from, to) {
    const { card, status, index } = this.findCard(from.id, from.status);

    if(card) { 
      // I know there's a way to consolidate these two calls... but not sure how
      this.setState(update(this.state, {
        cards: {[from.status] : {$splice:[[index, 1]]}
        }
      }));

      this.setState(update(this.state, {
        cards: {[to.status]: {$splice:[[to.index, 0, card]]}
        }
      }));
    }
  }

  findCard(id, status) {
    const { cards } = this.state;
    const card = cards[status].filter(c => c.id === id)[0];

    return {
      card,
      status,
      index: cards[status].indexOf(card)
    };
  }

  render() {
    const {board} = this.props;
    const { cards } = this.state;

    return (

        <div style={[styles.flexContainer]}>
          <div style={[styles.flexColumnContainer]}>
              <div style={[styles.flexHeaderRowContainer]}>
                  <div style={[styles.flexBoardHeader]}>
                   <h2 style={[styles.boardTitle]}>{board.title}</h2>
                  </div>
                  <div style={[styles.flexBoardHeader, styles.flexBoardSearchbox]}>
                      <TextField
                        hintText={<span><i style={[styles.boardSearchIcon]} className="material-icons">search</i>Search...</span>}
                        hintStyle={{paddingBottom: 5}}
                        type="search" />
                  </div>
              </div>
              <div style={[styles.flexHeaderRowContainer]}>
                 <div style={[styles.flexBoardHeader]}>
                   To Do
                  </div>
                  <div style={[styles.flexBoardHeader]}>
                  Doing
                  </div>
                  <div style={[styles.flexBoardHeader]}>
                   Done
                  </div>
              </div>
              <div style={[styles.flexRowContainer]}>
                  <Paper style={styles.flexBoardColumn} zDepth={0} rounded={false}>
                    <BoardColumn status = "todo" cards = {cards.todo} moveCard={this.moveCard}
                              findCard={this.findCard} /> 
                  </Paper>
                  <Paper style={styles.flexBoardColumn} zDepth={0} rounded={false}>
                       <BoardColumn status = "doing" cards = {cards.doing} moveCard={this.moveCard}
                              findCard={this.findCard} />
                  </Paper>
                  <Paper style={styles.flexBoardColumn} zDepth={0} rounded={false}>
                    <BoardColumn status = "done" cards = {cards.done} moveCard={this.moveCard}
                              findCard={this.findCard} />
                  </Paper>
              </div>
          </div>
        </div> 
    );
  }
};
