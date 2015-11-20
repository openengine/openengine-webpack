import React, {
  Component,
  PropTypes,
} from 'react';
import Radium from 'radium';
import { findDOMNode } from 'react-dom';
import Relay from 'react-relay';
import {
  Paper,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import { DragItemTypes } from '../constants';
import {
  DragSource,
  DropTarget,
} from 'react-dnd';
import MoveCardMutation from '../mutations/MoveCardMutation';
import RemoveCardMutation from '../mutations/RemoveCardMutation';
const styles = {
  card: (viewType)=>({
    borderRadius: 5,
    marginBottom: viewType === 'grid' ? '1.0rem' : '0.2rem',
    marginRight: '0.5rem',
    marginLeft: '0.5rem',
    minHeight: viewType === 'grid' ? 100 : 0,
    padding: viewType === 'grid' ? 10 : '2px 5px 2px 15px',
    flex: '1 0 auto',
    boxShadow: '0 0px 2px rgba(0, 0, 0, 0.15)',
  }),
  cardName: {
    fontSize: '0.9rem',
    fontWeight: 300,
    color: Colors.grey700,
    textAlign: 'left',
  },
};
const cardSource = {
  beginDrag(props, monitor, component) {
    // Send the height of the dragged card to show the correct sized placeHolder
    const height = findDOMNode(component).offsetHeight;
    return {
      card: props.card,
      boardColumn: props.boardColumn,
      height: height,
    };
  },
};
const cardTarget = {
  canDrop(props, monitor) {
    const { card } = monitor.getItem();
    if (card.id === props.card.id) {
      return false;
    }
    return true;
  },
  // If a card is dropped on another card, send that card's listRank to the boardColumn drop event
  drop(props) {
    return {
      droppedOnCardRank: props.card.rank,
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
@Radium
export default class BoardCard extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    card: PropTypes.object,
    cardIndex: PropTypes.number,
    boardColumn: PropTypes.object,
    isDragging: PropTypes.bool,
    isOver: PropTypes.bool,
    draggedItem: PropTypes.object,
    viewType: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.cardMenuSelected = this.cardMenuSelected.bind(this);
    this.state = {optionsExpanded: false};
  }
  cardMenuSelected(event, item) {
    switch (item.props.value) {
    case 'delete':
      Relay.Store.update(
      new RemoveCardMutation({
        boardColumn: this.props.boardColumn,
        card: this.props.card,
      })
    );
      break;
    default:

    }
  }
  render() {
    const { card, isDragging, isOver, draggedItem, connectDragSource,
       connectDropTarget, viewType } = this.props;
    // We will put the placeholder in when a card is hovering over this card. Always above since below
    // will be taken care of by the BoardColumn parent component (only on empty or below last card)
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
        display: isDragging ? 'none' : 'block',
        cursor: 'move',
      }}>
        {placeHolder}
        <Paper style={styles.card(viewType)} zDepth={0}>
          <h1 style={styles.cardName}>{card.name}</h1>
        </Paper>
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
        assignedTo
        rank
        ${MoveCardMutation.getFragment('card')},
        ${RemoveCardMutation.getFragment('card')},
      }
    `,
  },
});
