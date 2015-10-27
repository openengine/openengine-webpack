import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import Relay from 'react-relay';
import TextField from 'material-ui/lib/text-field'
import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import Card from './BoardCard'
import { DragDropContext } from 'react-dnd';
import { DragItemTypes } from "../constants"
import { DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const cardTarget = {
  drop() {
  }
};

// Right... so we need to seperate out this component because the Drag and Drop context will only work with the default exported class...
// And therefore, a Relay Container (as far as I know), will not work directly with React Dnd...
@DragDropContext(HTML5Backend)
@DropTarget(DragItemTypes.BOARDCARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
export default class DragBoard extends React.Component {
  
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired
  };

  constructor(props) {
      super(props);
      this.moveCard = this.moveCard.bind(this);
      this.findCard = this.findCard.bind(this);
      const {board} = this.props;
      this.state = {
        cards: Array.from(board.cards.edges, ed => ed.node)
      };
    }

   moveCard(id, atIndex) {
    const { card, index } = this.findCard(id);
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [index, 1],
          [atIndex, 0, card]
        ]
      }
    }));
  }

  findCard(id) {
    const { cards } = this.state;
    const card = cards.filter(c => c.id === id)[0];

    return {
      card,
      index: cards.indexOf(card)
    };
  }

  render() {
    const {board} = this.props;
    const { connectDropTarget } = this.props;
    const { cards } = this.state;

    return connectDropTarget(
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
               {cards.map(card => {
                return (
                  <Card key={card.id}
                        id={card.id}
                        text={card.title}
                        moveCard={this.moveCard}
                        findCard={this.findCard} />
                        );
                })}
            </Paper>
            <Paper className="flex-board-column" zDepth={0} rounded={false}>
            
            </Paper>
            <Paper className="flex-board-column" zDepth={0} rounded={false}>
             
            </Paper>
          </div>
        </div>
      </div>
    );
  }
};
