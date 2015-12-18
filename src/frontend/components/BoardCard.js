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
    component.setState({isTheDragged: true});
    return {
      card: props.card,
      boardColumn: props.boardColumn,
      height: height,
      index: props.cardIndex,
    };
  },
  endDrag(props, monitor, component) {
    if(monitor.didDrop()){
        component.setState({hasDropped: true});
    }
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
    style: PropTypes.object,
    setStyle: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.cardClicked = this.cardClicked.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.state = {optionsExpanded: false, isPressed: false, isTheDragged: false, hasDropped: false};
  }
  componentWillReceiveProps(nextProps){
    const {card, setStyle } = this.props;
    const height = findDOMNode(this._wholeMotion).offsetHeight;
    const paperHeight = findDOMNode(this._paper).offsetHeight;
    if (nextProps.style.dataHeight < paperHeight) {
      setStyle(card, paperHeight);
    }
  }
  componentDidMount() {
   window.addEventListener('touchend', this.handleMouseUp);
   window.addEventListener('mouseup', this.handleMouseUp);
  }
  componentWillUnmount(){
    this.setState({isPressed: false});
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mouseup', this.handleMouseUp);
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
       connectDropTarget, viewType, cardIndex, boardColumn, offsetDifference, style } = this.props;
    const { isPressed, isTheDragged, hasDropped } = this.state;

    // configuration for our animations
    const springConfig = [300, 50];
    let cardStyle = {
        scale: spring(1, springConfig),
        shadow: spring(1, springConfig),
        height: spring(0, springConfig),
    };
    if (isDragging) {
      cardStyle = {
          scale: 0,
          shadow: spring(0, springConfig),
          height: spring(0, springConfig),
        };
    } else {
      if (isPressed) {
        cardStyle = {
            scale: spring(1.1, springConfig),
            shadow: spring(16, springConfig),
            height: spring(0, springConfig),
          };
      }
    }

    if (draggedItem && draggedItem.card.id!==card.id && isOver) {
      cardStyle = {
          scale: spring(1, springConfig),
          shadow: spring(1, springConfig),
          height: spring(draggedItem.height, springConfig),
      };
    }

    // There is a special case that happens since our "placeholders" are on top of each card. Once dragging begins, the card immediately below
    // the dragged card will need to have its placeholder initially "hidden" otherwise a sudden jerky upward movement of the card below will take place
    const isNextCard = (draggedItem && boardColumn.id === draggedItem.boardColumn.id && cardIndex === draggedItem.index + 1);

    if (draggedItem && draggedItem.card.id!==card.id && isOver && isNextCard) {
      cardStyle = {
          scale: spring(1, springConfig),
          shadow: spring(1, springConfig),
          height: draggedItem.height,
      };
    }

    let isOverSelf = false;
    if (draggedItem && draggedItem.card.id===card.id && isOver) {
      isOverSelf = true;
      cardStyle = {
          scale:  spring(1, springConfig),
          shadow: spring(0, springConfig),
          height: 0,
      };
    }

    let overAllHeight = hasDropped || (isDragging && !isOverSelf) ? 0 : style.height;
    let overAllOpacity = (hasDropped || isDragging || isOverSelf) ? 0 : style.opacity;
    let overAllPaddingBottom = isDragging || hasDropped ? 0 : style.paddingBottom;
    let overAllPaddingTop= isDragging || hasDropped ? 0 : style.paddingTop;

    return connectDragSource(connectDropTarget(
      <div>
        <Motion style={cardStyle} key={card.id}>
              {({scale, shadow, height}) =>
              <div>
                <div style={{
                  width: '100%',
                  height: height,
                  background: Colors.blueGrey100,
                }}/>
                <div
                  onMouseDown={this.handleMouseDown}
                  onMouseUp={this.handleMouseUp}
                  onTouchEnd={this.handleMouseUp}
                  onTouchStart={this.handleTouchStart}
                  ref={(ref) => this._wholeMotion = ref}
                  style={{
                    cursor: isDragging ? 'grabbing' : 'pointer',
                    height: overAllHeight,
                    opacity: overAllOpacity,
                    paddingBottom: overAllPaddingBottom,
                    paddingTop: overAllPaddingTop,
                  }}>
                  <Paper ref={(ref) => this._paper = ref} onClick={this.cardClicked} style={{
                          borderRadius: 5,
                          marginBottom: viewType === 'grid' ? '1.0rem' : '0.2rem',
                          marginRight: '0.5rem',
                          marginLeft: '0.5rem',
                          minHeight: viewType === 'grid' ? 100 : 0,
                          padding: viewType === 'grid' ? 10 : '2px 5px 2px 15px',
                          flex: '1 0 auto',
                          boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                      }} zDepth={0}>
                      <h1 style={styles.cardName}>{card.name}</h1>
                    </Paper>
                </div>
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
