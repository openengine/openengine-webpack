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
import {Motion, spring} from 'react-motion';
import CardDetails from './CardDetails';
import MoveCardMutation from '../mutations/MoveCardMutation';
const styles = {
  card: (viewType, isOver)=>({
    borderRadius: 5,
    marginBottom: viewType === 'grid' ? '1.0rem' : '0.2rem',
    marginRight: '0.5rem',
    marginLeft: '0.5rem',
    minHeight: viewType === 'grid' ? 100 : 0,
    opacity: isOver ? 0 : 1,
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
      index: props.cardIndex,
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
  hover(props, monitor) {
    const { card: draggedCard } = monitor.getItem();
    const { card: overCard, cardIndex } = props;

    if (draggedCard.id !== overCard.id) {
        //console.log('card hover: ', cardIndex, " : " ,hoverMode);
    //  console.log("HOVER: ", cardIndex);
    //  monitor.getItem().hoverIndex = cardIndex;
      // const from = {id: draggedId, status: draggedStatus};
      // const to = {index: overIndex, status: overStatus }
      //
      // props.moveCard(from, to);
      //
      // if(draggedStatus!==overStatus) {
      //   // So I think this might actually be frowned upon (mutating here)... but it works for now.
      //     monitor.getItem().currentStatus = overStatus;
      // }
    }
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
  offsetDifference: monitor.getDifferenceFromInitialOffset(),
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
    clientOffset: PropTypes.object,
    isOver: PropTypes.bool,
    offsetDifference: PropTypes.object,
    draggedItem: PropTypes.object,
    viewType: PropTypes.string,
    toggleCardDetails: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.cardClicked = this.cardClicked.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.state = {optionsExpanded: false, isPressed: false};
  }
  componentDidMount() {
  //  window.addEventListener('touchend', this.handleMouseUp);
  //  window.addEventListener('mouseup', this.handleMouseUp);
  }
  componentWillUnmount(){
    this.setState({isPressed: false});
  }
  cardClicked() {
    this.props.toggleCardDetails(this.props.card);
  }
  handleTouchStart() {
    this.handleMouseDown();
  }

  handleMouseDown() {
    this.setState({ isPressed: true});
  }
  handleMouseUp() {
     this.setState({isPressed: false});
  }
  render() {
    const { card, isDragging, isOver, draggedItem, connectDragSource,
       connectDropTarget, viewType, cardIndex, boardColumn, offsetDifference } = this.props;
    const { isPressed } = this.state;

    // configuration for our animations
    const springConfig = [300, 50];
    let style = {
        scale: spring(1, springConfig),
        shadow: spring(1, springConfig),
        height: spring(0, springConfig),
    };
    if (isDragging) {
      style = {
          scale: 0,
          shadow: spring(0, springConfig),
          height: spring(0, springConfig),
        };
    } else {
      if (isPressed) {
        style = {
            scale: spring(1.1, springConfig),
            shadow: spring(16, springConfig),
            height: spring(0, springConfig),
          };
      }
    }

    if (draggedItem && draggedItem.card.id!==card.id && isOver) {
      style = {
          scale: spring(1, springConfig),
          shadow: spring(1, springConfig),
          height: spring(draggedItem.height, springConfig),
      };
    }

    // There is a special case that happens since our "placeholders" are on top of each card. Once dragging begins, the card immediately below
    // the dragged card will need to have its placeholder initially "hidden" otherwise a sudden jerky upward movement of the card below will take place
    const isNextCard = (draggedItem && boardColumn.id === draggedItem.boardColumn.id && cardIndex === draggedItem.index + 1);

    if (draggedItem && draggedItem.card.id!==card.id && isOver && isNextCard) {
      console.log("HoverMode: ")
      style = {
          scale: spring(1, springConfig),
          shadow: spring(1, springConfig),
          height: draggedItem.height,
      };
    }


    let isOverSelf = false;
    if (draggedItem && draggedItem.card.id===card.id && isOver) {
      isOverSelf = true;
      style = {
          scale:  spring(1, springConfig),
          shadow: spring(0, springConfig),
          height: 0,
      };
    }

    return connectDragSource(connectDropTarget(
      <div>
        <Motion style={style} key={card.id}>
              {({scale, shadow, height}) =>
                <div
                  onMouseDown={this.handleMouseDown}
                  onMouseUp={this.handleMouseUp}
                  onTouchEnd={this.handleMouseUp}
                  onTouchStart={this.handleTouchStart}
                  style={{
                    cursor: isDragging ? 'grabbing' : 'pointer',
                    height: (isDragging && !isOverSelf) ? 0 : 'auto',
                  }}>
                    <div style={{
                      width: '100%',
                      height: height,
                      background: Colors.blueGrey50,
                    }}/>
                  <Paper onClick={this.cardClicked} style={{
                          borderRadius: 5,
                          marginBottom: viewType === 'grid' ? '1.0rem' : '0.2rem',
                          marginRight: '0.5rem',
                          marginLeft: '0.5rem',
                          minHeight: viewType === 'grid' ? 100 : 0,
                          opacity: isOverSelf ? 0 : 1,
                          padding: viewType === 'grid' ? 10 : '2px 5px 2px 15px',
                          flex: '1 0 auto',
                          boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                          transform: `scale(${scale})`,
                          WebkitTransform: `scale(${scale})`,
                      }} zDepth={0}>
                      <h1 style={styles.cardName}>{card.name}</h1>
                    </Paper>
                </div>
              }
        </Motion>
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
        ${CardDetails.getFragment('card')}
        ${MoveCardMutation.getFragment('card')},
      }
    `,
  },
});
