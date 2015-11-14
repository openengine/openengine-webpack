import React, { PropTypes } from 'react';
import Radium from 'radium';
import Relay from 'react-relay';
import { Paper } from 'material-ui';
import BoardCard from './BoardCard';
import { DragItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';
import Colors from 'material-ui/lib/styles/colors';
import MoveCardMutation from '../mutations/MoveCardMutation';
const styles = {
  container: {
    fontFamily: 'Roboto, sans-serif',
  },

  rowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
    padding: 3,
    minHeight: 500,
  },

  headerRowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
    padding: 3,
  },

  columnContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: '1 0 auto',
  },

  cardList: {
    flex: '1 0 auto',
    boxShadow: '0 0px 2px rgba(0, 0, 0, 0.15)',
  },

  cardListName: {
    flex: '1 0 auto',
    fontSize: '1.0rem',
    fontWeight: 100,
    color: '#9E9E9E',
  },

  cardListContainer: (isOver) => ({
    minHeight: 500,
    boxShadow: (isOver ? '0px -1px 0px 1px #90A4AE' : '0px 0px 0px 0px #90A4AE'),
  }),
};

// Used to sort cards in a cardList by the specified field
const sortCards = (cardList, sortBy) => {
  return cardList.cards.edges.map(({node}) => node).sort((cardA, cardB) => {
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
  // that card's CardList via mutation
  drop(props, monitor) {
    const { cardList } = props;
    const { card, cardList: fromCardList } = monitor.getItem();
    const cards = sortCards(cardList, 'cardListRank');
    let toRank = 0;

    // Dropped on/between cards, set new rank for dropped card
    if (monitor.didDrop()) {
      const { droppedOnCardIndex, droppedOnCardRank } = monitor.getDropResult();

      // If it was dropped on the top card, just set rank less than the top card
      toRank = droppedOnCardRank - 1.0;

      if (droppedOnCardIndex !== 0) {
        // The new rank of the dropped card will be between the card it was dropped on and the one above it
        toRank = (droppedOnCardRank + cards[droppedOnCardIndex - 1].cardListRank) / 2;
      }
    } else { // Dropped into the cardList with either A.) no cards in it, or B.) below all other cards in cardList
      if (cards.length > 0) {
        toRank = cards[cards.length - 1].cardListRank + 1;
      }
    }

    Relay.Store.update(
      new MoveCardMutation({
        card: card,
        fromCardList: fromCardList,
        toCardList: cardList,
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
class CardList extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverOnly: PropTypes.bool.isRequired,
    cardList: PropTypes.object.isRequired,
    draggedItem: PropTypes.object,
  };
  render() {
    const { connectDropTarget, isOver, isOverOnly, draggedItem } = this.props;
    const { cardList } = this.props;
    const cards = sortCards(cardList, 'cardListRank');
    // We will put the placeholder in when a card is hovering over the empty part of the cardList.
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
          <div style={[styles.cardListName]}>
            {cardList.name}
          </div>
        </div>
        <div style={[styles.columnContainer]}>
        {connectDropTarget(
          <div style={[styles.cardListContainer(isOver)]}>
            {cards.map(card => {
              return (
                <Paper key={card.id} style={styles.cardList} zDepth={0} rounded={false} >
                  <BoardCard
                    card={card}
                    cardIndex={cards.indexOf(card)}
                    cardList={cardList}
                    />
                </Paper>
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
export default Relay.createContainer(CardList, {
  prepareVariables() {
    return {
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991,
    };
  },

  fragments: {
    cardList: () => Relay.QL`
      fragment on CardList {
        id
        name
        boardRank
        cards(first: $limit) {
          edges {
            node {
              id
              cardListRank,
              ${BoardCard.getFragment('card')},
            }
          }
        },
        ${MoveCardMutation.getFragment('fromCardList')},
        ${MoveCardMutation.getFragment('toCardList')},
      }
    `,
  },
});
