import React, {
  Component,
  PropTypes,
} from 'react';
import Relay from 'react-relay';
import Colors from 'material-ui/lib/styles/colors';
import { DragItemTypes } from '../constants';
import {
  DropTarget,
} from 'react-dnd';
import {Motion, spring} from 'react-motion';
import BoardCardDraggable from './BoardCardDraggable';

const cardTarget = {
  canDrop(props, monitor) {
    const { card } = monitor.getItem();
    if (card.id === props.card.id) {
      return false;
    }
    return true;
  },
  // hover(props, monitor) {
  //   // const { card, index, boardColumn } = monitor.getItem();
  //   // We set this board column's drag counter so that we know when to turn the initial card's placeholder animation back on.
  //   // if (props.boardColumn.id===boardColumn.id && props.cardIndex === index && props.getDragCounter() < 2) {
  //   //   props.setDragCounter();
  //   // }
  // },
  // If a card is dropped on another card, send that card's listRank to the boardColumn drop event
  drop(props) {
    return {
      droppedOnCardRank: props.card.rank,
      droppedOnCardIndex: props.cardIndex,
      droppedOnBoardColumn: props.boardColumn,
    };
  },
};

@DropTarget(DragItemTypes.BOARDCARD, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  draggedItem: monitor.getItem(),
}))
class BoardCard extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    card: PropTypes.object,
    cardIndex: PropTypes.number,
    boardColumn: PropTypes.object,
    isOver: PropTypes.bool,
    draggedItem: PropTypes.object,
    viewType: PropTypes.string,
    toggleCardDetails: PropTypes.func,
    style: PropTypes.object,
    setStyle: PropTypes.func,
  };
  constructor(props) {
    super(props);
  }

  render() {
    const {card, isOver, draggedItem, connectDropTarget} = this.props;
    const { toggleCardDetails, style, setStyle, cardIndex, viewType, boardColumn } = this.props; // For child BoardCardDraggable component

    // configuration for our animations
    const springConfig = [300, 50];

    let cardStyle = { // The default animation style for all our cards
      placeHolderHeight: spring(0, springConfig),
      margin: spring(0, springConfig),
    };

    let isBefore = true;

    // ****** DropTarget Animation Styles (when the card in question is being hovered over/dropped on)
    if (draggedItem && draggedItem.card.id !== card.id && isOver) {
      cardStyle = {
        placeHolderHeight: spring(draggedItem.height, springConfig),
        margin: spring(0.2, springConfig),
      };
    }

    const isOverSelf = draggedItem && draggedItem.card.id === card.id && isOver;

    if (draggedItem && draggedItem.index < cardIndex && draggedItem.boardColumn.id === boardColumn.id) {
      isBefore = false;
    }

    return connectDropTarget(
      <div>
        <Motion style={cardStyle} key={card.id}>
              {({placeHolderHeight, margin}) =>
                <div>
                  <div
                    style={{
                      display: (isBefore || isOverSelf) ? 'block' : 'none',
                      borderRadius: 5,
                      backgroundColor: Colors.blueGrey100,
                      borderWidth: 0,
                      borderStyle: 'dotted',
                      borderColor: Colors.blueGrey100,
                      marginRight: '0.5rem',
                      marginLeft: '0.5rem',
                      height: placeHolderHeight,
                      marginBottom: margin + 'rem',
                      marginTop: margin + 'rem',
                      flex: '1 1 auto',
                    }} />
                  <BoardCardDraggable key={card.id} card={card} cardIndex={cardIndex} viewType={viewType} boardColumn={boardColumn}
                  style={style} toggleCardDetails={toggleCardDetails} setStyle={setStyle} isOverSelf={isOverSelf} />
                  <div
                    style={{
                      display: (isBefore || isOverSelf) ? 'none' : 'block',
                      borderRadius: 5,
                      backgroundColor: Colors.blueGrey100,
                      borderWidth: 0,
                      borderStyle: 'dotted',
                      borderColor: Colors.blueGrey100,
                      marginRight: '0.5rem',
                      marginLeft: '0.5rem',
                      marginBottom: margin + 'rem',
                      marginTop: margin + 'rem',
                      height: placeHolderHeight,
                      flex: '1 1 auto',
                    }} />
                </div>
              }
        </Motion>
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
        rank
        ${BoardCardDraggable.getFragment('card')}
      }
    `,
  },
});
