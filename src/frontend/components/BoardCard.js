import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import MaterialCard from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import Avatar from 'material-ui/lib/avatar'
import FontIcon from 'material-ui/lib/font-icon';
import { DragItemTypes } from "../constants"
import { DragSource, DropTarget } from 'react-dnd';


const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findCard(props.id).index
    };
  },

  endDrag(props, monitor) {
    const { id: droppedId, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      props.moveCard(droppedId, originalIndex);
    }
  }
};

const cardTarget = {
  canDrop() {
    return false;
  },

  hover(props, monitor) {
    const { id: draggedId } = monitor.getItem();
    const { id: overId } = props;

    if (draggedId !== overId) {
      const { index: overIndex } = props.findCard(overId);
      props.moveCard(draggedId, overIndex);
    }
  }
};

@DropTarget(DragItemTypes.BOARDCARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(DragItemTypes.BOARDCARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Card extends Component {
static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired,
    findCard: PropTypes.func.isRequired
  };


  render() {
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
      <div style={{
          opacity: isDragging ? 0 : 1,
          cursor: 'move'
        }}>
      {isDragging && ' (and I am being dragged now)'}
        <MaterialCard initiallyExpanded={false}>
          <CardHeader
            title={text}
            avatar={<Avatar src="https://s3.amazonaws.com/uifaces/faces/twitter/sauro/48.jpg" style={{float:'right'}}></Avatar>}
            actAsExpander={false}
            showExpandableButton={false}>
          </CardHeader>
        </MaterialCard>
      </div>
    ));
  }
};

// export default Relay.createContainer(Card, {
//   fragments: {
//     card: () => Relay.QL`
//       fragment on Card {
//         title
//       }
//     `,
//   },
// });


