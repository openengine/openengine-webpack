import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import MaterialCard from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import Avatar from 'material-ui/lib/avatar'
import FontIcon from 'material-ui/lib/font-icon';
import { Link } from 'react-router'
import { DragItemTypes } from "../constants"
import { DragSource, DropTarget } from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    console.log('BoardCard#beginDrag', props);
    return {
      card: props.card
      //id: props.id,
      //currentStatus: props.status,
      //originalStatus: props.status,
      //originalIndex: props.findCard(props.id, props.status).index
    };
  },

  endDrag(props, monitor) {
    console.log('BoardCard#endDrag', props, monitor);
    const { id: droppedId, originalStatus, currentStatus, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();
 // const dropColumn = monitor.getDropResult();

    // This means it was dropped outside of a dropzone... so put it back in its original spot
    if(!didDrop) {
      const from = {id: droppedId, status: currentStatus};
      const to = {index: originalIndex, status: originalStatus}
      props.moveCard(from, to);
    }
  }
};

const cardTarget = {
  canDrop() {
    return false;
  },

  // TODO: Hover should adjust the cardListRank of the source card so
  // it displays in the correct position amongst the other cards
  // This will probably need to take into account the other cards in
  // the cardList, because we'll have to calculate the cardListRank based
  // on where we are trying to drop.
  hover(props, monitor) {
    console.log('BoardCard#hover', props, monitor.getItem());

    // So I think this might actually be frowned upon (mutating here)... but it works for now.
    monitor.getItem().cardListRank = props.cardListRank;
  },

  //hover(props, monitor) {
    //const { id: draggedId, currentStatus: draggedStatus } = monitor.getItem();
    //const { id: overId, status: overStatus } = props;

    //if (draggedId !== overId) {
      ////const { index: overIndex } = props.findCard(overId, draggedStatus);
      //const from = {id: draggedId, status: draggedStatus};
      //const to = {index: overIndex, status: overStatus };

      //props.moveCard(from, to);

      //if(draggedStatus !== overStatus) {
        //// So I think this might actually be frowned upon (mutating here)... but it works for now.
        //monitor.getItem().currentStatus = overStatus;
      //}
    //}
  //}
};

@DropTarget(DragItemTypes.BOARDCARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(DragItemTypes.BOARDCARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    //moveCard: PropTypes.func.isRequired,
    //findCard: PropTypes.func.isRequired
  };

  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
    const { card } = this.props;
    const { name, id } = card;

    return connectDragSource(connectDropTarget(
      <div style={{
          opacity: isDragging ? 0 : 1,
          cursor: 'move'
        }}>
        <MaterialCard initiallyExpanded={false}>
          <CardHeader
            title={<Link to={`/card/${id}`}>{name}</Link>}
            titleStyle={{cursor:'pointer'}}
            nameStyle = {{display:'block'}}
            avatar={<Avatar src="https://s3.amazonaws.com/uifaces/faces/twitter/sauro/48.jpg" style={{float:'right'}}></Avatar>}
            actAsExpander={false}
            showExpandableButton={false}>
          </CardHeader>
        </MaterialCard>
      </div>
    ));
  }
};

export default Relay.createContainer(Card, {
  fragments: {
    card: () => Relay.QL`
      fragment on Card {
        id
        name
        cardListRank
      }
    `,
  },
});
