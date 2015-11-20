import React, { PropTypes } from 'react';
import Radium from 'radium';
import Relay from 'react-relay';
import BoardCard from './BoardCard';
import { DragItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';
import Colors from 'material-ui/lib/styles/colors';
import MoveCardMutation from '../mutations/MoveCardMutation';
import DeleteCardMutation from '../mutations/DeleteCardMutation';
const styles = {
  headerRowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
  },

  columnContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: '0 1 auto',
    margin: '0.3rem',
    backgroundColor: Colors.grey100,
    borderRadius: 5,
  },

  boardColumnName: {
    flex: '0 1 auto',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: Colors.grey500,
    paddingTop: '1.5rem',
    paddingBottom: '1.0rem',
    letterSpacing: 2,
  },

  boardColumnContainer: (isOver) => ({
    minHeight: 500,
    boxShadow: (isOver ? '0px -1px 0px 1px #90A4AE' : '0px 0px 0px 0px #90A4AE'),
  }),
};

// Used to sort cards in a boardColumn by the specified field
const sortCards = (boardColumn, sortBy) => {
  return boardColumn.cards.edges.map(({node}) => node).sort((cardA, cardB) => {
    if (cardA[sortBy] >= cardB[sortBy]) {
      return 1;
    }
    if (cardA[sortBy] < cardB[sortBy]) {
      return -1;
    }
  });
};

const columnTarget = {
  canDrop() {
    return true;
  },
  // When a card is dropped in a column, we want to update
  // that card's BoardColumn via mutation
  drop(props, monitor) {
    const { boardColumn } = props;
    const { card, boardColumn: fromBoardColumn } = monitor.getItem();
    const cards = sortCards(boardColumn, 'rank');
    let toRank = 0;

    // Dropped on/between cards, set new rank for dropped card
    if (monitor.didDrop()) {
      const { droppedOnCardIndex, droppedOnCardRank } = monitor.getDropResult();

      // If it was dropped on the top card, just set rank less than the top card
      toRank = droppedOnCardRank - 1.0;

      if (droppedOnCardIndex !== 0) {
        // The new rank of the dropped card will be between the card it was dropped on and the one above it
        toRank = (droppedOnCardRank + cards[droppedOnCardIndex - 1].rank) / 2;
      }
    } else { // Dropped into the boardColumn with either A.) no cards in it, or B.) below all other cards in boardColumn
      if (cards.length > 0) {
        toRank = cards[cards.length - 1].rank + 1;
      }
    }

    Relay.Store.update(
      new MoveCardMutation({
        card: card,
        fromBoardColumn: fromBoardColumn,
        toBoardColumn: boardColumn,
        toRank: toRank,
      })
    );
  },
};

@DropTarget(DragItemTypes.BOARDCARD, columnTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverOnly: monitor.isOver({shallow: true}),
  draggedItem: monitor.getItem(),
}))
@Radium
class BoardColumn extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverOnly: PropTypes.bool.isRequired,
    boardColumn: PropTypes.object.isRequired,
    draggedItem: PropTypes.object,
  };
  render() {
    const { connectDropTarget, isOver, isOverOnly, draggedItem } = this.props;
    const { boardColumn } = this.props;
    const cards = sortCards(boardColumn, 'rank');
    // We will put the placeholder in when a card is hovering over the empty part of the boardColumn.
    let placeHolder = '';
    // if there is a draggedItem that is picked up by the "dropMonitor" put in the placeHolder
    if (draggedItem && isOverOnly) {
      placeHolder = (
        <div style={{
          display: isOverOnly ? 'block' : 'none',
          width: '100%',
          height: draggedItem.height,
          background: Colors.blueGrey50,
        }}/>
    );
    }
    return (
      <div style={[styles.columnContainer]}>
        <div style={[styles.headerRowContainer]}>
          <div style={[styles.boardColumnName]}>
            {boardColumn.name}
          </div>
        </div>
        <div style={[styles.columnContainer]}>
        {connectDropTarget(
          <div style={[styles.boardColumnContainer(isOver)]}>
            {cards.map(card => {
              return (
                  <BoardCard
                    key={card.id}
                    card={card}
                    cardIndex={cards.indexOf(card)}
                    boardColumn={boardColumn}
                    />
              );
            })}
            {placeHolder}
          </div>
        )}
        </div>
      </div>
    );
  }
}
export default Relay.createContainer(BoardColumn, {
  prepareVariables() {
    return {
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991,
    };
  },

  fragments: {
    boardColumn: () => Relay.QL`
      fragment on BoardColumn {
        id
        name
        rank
        cards(first: $limit) {
          edges {
            node {
              id
              rank,
              ${BoardCard.getFragment('card')},
            }
          }
        },
        ${MoveCardMutation.getFragment('fromBoardColumn')},
        ${MoveCardMutation.getFragment('toBoardColumn')},
        ${DeleteCardMutation.getFragment('boardColumn')},
      }
    `,
  },
});
