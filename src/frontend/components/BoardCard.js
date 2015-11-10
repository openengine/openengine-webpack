import React, {
  Component,
  PropTypes,
} from 'react';
import { findDOMNode } from 'react-dom';
import Relay from 'react-relay';
import MaterialCard from 'material-ui/lib/card/card';
import {
  CardHeader,
  Avatar,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import { Link } from 'react-router';
import { DragItemTypes } from '../constants';
import {
  DragSource,
  DropTarget,
} from 'react-dnd';

const cardSource = {
  beginDrag(props, monitor, component) {
    console.log('BoardCard#beginDrag', props);
    // Send the height of the dragged card to show the correct sized placeHolder
    const height = findDOMNode(component).offsetHeight;
    return {
      card: props.card,
      height: height,
    };
  },
};
const cardTarget = {
  canDrop() {
    return true;
  },
  // If a card is dropped on another card, send that card's listRank to the cardList drop event
  drop(props) {
    return {
      droppedOnCardRank: props.card.cardListRank,
      droppedOnCardIndex: props.cardIndex,
    };
  },
};

@DropTarget(DragItemTypes.BOARDCARD, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  draggedItem: monitor.getItem(),
}))
@DragSource(DragItemTypes.BOARDCARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class BoardCard extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    card: PropTypes.object,
    cardIndex: PropTypes.number,
    cardList: PropTypes.object,
    isDragging: PropTypes.bool,
    isOver: PropTypes.bool,
    draggedItem: PropTypes.object,
  };

  render() {
    const { card, isDragging, isOver, draggedItem, connectDragSource, connectDropTarget } = this.props;

    // We will put the placeholder in when a card is hovering over this card. Always above since below
    // will be taken care of by the CardList parent component (only on empty or below last card)
    let placeHolder = '';
    // if there is a draggedItem that is picked up by the "dropMonitor" put in the placeHolder
    if (draggedItem) {
      placeHolder = (
        <div style={{
          display: isOver ? 'block' : 'none',
          width: '100%',
          height: draggedItem.height,
          background: Colors.blueGrey50,
        }}/>
    );
    }
    return connectDragSource(connectDropTarget(
      <div style={{
        opacity: isDragging ? 0 : 1,
        cursor: 'move',
      }}>
      {placeHolder}
        <MaterialCard initiallyExpanded={false}>
          <CardHeader
            title={<Link to={`/card/${card.id}`}>{card.name}</Link>}
            titleStyle={{cursor: 'pointer'}}
            textStyle = {{display: 'block'}}
            avatar={<Avatar src="https://s3.amazonaws.com/uifaces/faces/twitter/sauro/48.jpg" style={{float: 'right'}} />}
            actAsExpander={false}
            showExpandableButton={false} />
        </MaterialCard>
      </div>
    ));
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
