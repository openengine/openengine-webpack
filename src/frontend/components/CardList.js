import React, { PropTypes } from 'react';
import Radium from 'radium';
import Relay from 'react-relay';
import { Paper } from 'material-ui';
import BoardCard from './BoardCard';
import { DragItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';
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
    minHeight: 550,
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
    justifyContent: 'center',
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
    height: 800,
    outline: (isOver ? '#90A4AE solid 1px' : 'none'),
  }),
};

const columnTarget = {
  canDrop() {
    return true;
  },
  // When a card is dropped in a column, we want to update
  // that card's CardList via mutation
  drop(props, monitor) {
    if (monitor.didDrop()) { // It was dropped on or between cards
      // Dropped on/between cards set new rank and list for dropped card
      const { droppedOnCardRank } = monitor.getDropResult();
      const { cardList } = props;
    } // // It was dropped on card list but not top/between other cards
  },
};

@DropTarget(DragItemTypes.BOARDCARD, columnTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))
@Radium
class CardList extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    cardList: PropTypes.object.isRequired,
    moveCard: PropTypes.func,
    findCard: PropTypes.func,
  };

  render() {
    const { connectDropTarget, isOver } = this.props;

    const { cardList } = this.props;

    let cards = cardList.cards.edges.map(({node}) => node);
    cards = cards.sort((cardA, cardB) => {
      if (cardA.cardListRank >= cardB.cardListRank) {
        return 1;
      }
      if (cardA.cardListRank < cardB.cardListRank) {
        return -1;
      }
    });

    return connectDropTarget(
      <div style={[styles.columnContainer]}>
        <div style={[styles.headerRowContainer]}>
          <div style={[styles.cardListName]}>
            {cardList.name}
          </div>
        </div>
        <div style={[styles.columnContainer]}>
          <div style={[styles.cardListContainer(isOver)]}>
            {cards.map(card => {
              return (
                <Paper key={card.id} style={styles.cardList} zDepth={0} rounded={false} >
                  <BoardCard
                    card={card}
                    cardList={cardList}
                    />
                </Paper>
              );
            })}
          </div>
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
              cardListRank
              ${BoardCard.getFragment('card')}
            }
          }
        }
      }
    `,
  },
});
