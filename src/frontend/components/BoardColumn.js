import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import Relay from 'react-relay';
import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import Colors from 'material-ui/lib/styles/colors'
import Card from './BoardCard'
import { DragDropContext } from 'react-dnd';
import { DragItemTypes } from "../constants"
import { DragSource, DropTarget } from 'react-dnd';

const columnTarget = {
  canDrop() {
    return true;
  },

  drop(props, monitor) {
     return { status: props.status }
  },
 hover(props, monitor) {
    const { id: draggedId, currentStatus: draggedStatus } = monitor.getItem();
    const { status: overStatus, cards } = props;

    // This will only happen over the empty (bottom) portions of a column. BoardCard will handle when hovering happens over a list.
    if (overStatus!==draggedStatus && monitor.isOver({shallow: true})) {

      const from = {id: draggedId, status: draggedStatus};
      const to = {index: cards.length, status: overStatus }

      props.moveCard(from, to);

      if(draggedStatus!==overStatus) {
        // So I think this might actually be frowned upon (mutating here)... but it works for now. 
          monitor.getItem().currentStatus = overStatus;
      }
    }
  }
};

@DropTarget(DragItemTypes.BOARDCARD, columnTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
export default class BoardColumn extends React.Component {
  
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired
  };

  render() {

    const { connectDropTarget, isOver } = this.props;
    const { cards } = this.props;

    return connectDropTarget(
      <div style={{
          height: 800,
          outline: isOver ? '#90A4AE solid 1px' : 'none'
        }}>
          {cards.map(card => {
                return (
                  <Card key={card.id}
                        id={card.id}
                        status={this.props.status}
                        text={card.title}
                        moveCard={this.props.moveCard}
                        findCard={this.props.findCard} />
                        );
                })}
      </div>
    );
  }
};
