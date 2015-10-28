import React, { Component, PropTypes } from 'react';
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


// Right... so we need to seperate out this component because the Drag and Drop context will only work with the default exported class...
// And therefore, a Relay Container (as far as I know), will not work directly with React Dnd...
@DragDropContext(HTML5Backend)
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
      <div className="flex-board">
        <div className="flex-column-container">
          <div className="flex-header-row-container">
            <div className="flex-board-header">
               <h2 className="board-title">{board.title}</h2>
              </div>
              <div className="flex-board-header flex-board-searchbox">
                  <TextField
                    hintText={<span><i className="material-icons board-search-icon">search</i>Search...</span>}
                    hintStyle={{paddingBottom: 5}}
                    type="search" />
              </div>
          </div>
          <div className="flex-header-row-container">
            <div className="flex-board-header">
              To Do
            </div>
            <div className="flex-board-header">
              Doing
            </div>
            <div className="flex-board-header">
              Done
            </div>
          </div>
          <div className="flex-row-container">
            <Paper className="flex-board-column" zDepth={0} rounded={false}>
              <BoardColumn status = "todo" cards = {cards.todo} moveCard={this.moveCard}
                        findCard={this.findCard} /> 
            </Paper>
            <Paper className="flex-board-column" zDepth={0} rounded={false}>
                 <BoardColumn status = "doing" cards = {cards.doing} moveCard={this.moveCard}
                        findCard={this.findCard} />
            </Paper>
            <Paper className="flex-board-column" zDepth={0} rounded={false}>
              <BoardColumn status = "done" cards = {cards.done} moveCard={this.moveCard}
                        findCard={this.findCard} />
            </Paper>
          </div>
        </div>
      </div>
    );
  }
};
