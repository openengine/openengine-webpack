import React, {
  Component,
  PropTypes,
} from 'react';
import Relay from 'react-relay';
import MaterialCard from 'material-ui/lib/card/card';
import {
  CardHeader,
  Avatar,
} from 'material-ui';
import { Link } from 'react-router';
import { DragItemTypes } from '../constants';
import {
  DragSource,
  DropTarget,
} from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    console.log('BoardCard#beginDrag', props);
    return {
      card: props.card,
    };
  },

  endDrag(props, monitor) {
    console.log('BoardCard#endDrag', monitor.didDrop(), props, monitor, monitor.getDropResult());
    const { id: droppedId, originalStatus, currentStatus, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();
    // const dropColumn = monitor.getDropResult();

    // This means it was dropped outside of a dropzone... so put it back in its original spot
    if (!didDrop) {
      const from = {id: droppedId, status: currentStatus};
      const to = {index: originalIndex, status: originalStatus};
      props.moveCard(from, to);
    }
  },
};
const cardTarget = {
  canDrop() {
    return false;
  },

  hover(props, monitor) {
    const { id: draggedId, currentStatus: draggedStatus } = monitor.getItem();
    const { id: overId, status: overStatus } = props;

    if (draggedId !== overId) {
      const { index: overIndex } = props.findCard(overId, draggedStatus);
      const from = {id: draggedId, status: draggedStatus};
      const to = {index: overIndex, status: overStatus };

      props.moveCard(from, to);

      if (draggedStatus !== overStatus) {
        // So I think this might actually be frowned upon (mutating here)... but it works for now.
        monitor.getItem().currentStatus = overStatus;
      }
    }
  },
};

@DropTarget(DragItemTypes.BOARDCARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(DragItemTypes.BOARDCARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class BoardCard extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    id: PropTypes.any.isRequired,
    text: PropTypes.string,
    status: PropTypes.string,
    moveCard: PropTypes.func.isRequired,
    findCard: PropTypes.func.isRequired,
  };

  render() {
    const { text, isDragging, connectDragSource, id } = this.props;

    return connectDragSource(
      <div style={{
        opacity: isDragging ? 0 : 1,
        cursor: 'move',
      }}>
      <MaterialCard initiallyExpanded={false}>
        <CardHeader
          title={<Link to={`/card/${id}`}>{text}</Link>}
          titleStyle={{cursor: 'pointer'}}
          textStyle = {{display: 'block'}}
          avatar={<Avatar src="https://s3.amazonaws.com/uifaces/faces/twitter/sauro/48.jpg" style={{float: 'right'}} />}
          actAsExpander={false}
          showExpandableButton={false} />
      </MaterialCard>
      </div>
    );
  }
}

export default Relay.createContainer(BoardCard, {
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
