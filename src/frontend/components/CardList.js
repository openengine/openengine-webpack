import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import update from 'react/lib/update';
import Relay from 'react-relay';
import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import Colors from 'material-ui/lib/styles/colors'
import BoardCard from './BoardCard'
import { DragDropContext } from 'react-dnd';
import { DragItemTypes } from "../constants"
import { DragSource, DropTarget } from 'react-dnd';

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
    minHeight: 550
  },

  headerRowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
    padding: 3
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
    boxShadow: '0 0px 2px rgba(0, 0, 0, 0.15)'
  },

  cardListName: {
    flex: '1 0 auto',
    fontSize:'1.0rem',
    fontWeight:100,
    color: '#9E9E9E'
  },

  cardListContainer: (isOver) => ({
    height: 800,
    outline: (isOver ? '#90A4AE solid 1px' : 'none')
  }),
};

const columnTarget = {
  // When a card is dropped in a column, we want to update
  // that card's CardList via mutation
  drop(props, monitor) {
    console.log('CardList#drop', props);

    return {
      status: props.status
    }
  },

  hover(props, monitor) {
    console.log('CardList#hover', props, monitor.getItem());
  }

  // QUESTION: When hovering a cardList, temporarily set the card's cardList
  // to the hovered list?
  //hover(props, monitor) {
    //console.log('CardList#hover', props, monitor.getItem());
    //const { id: draggedId, currentStatus: draggedStatus } = monitor.getItem();
    //const { status: overStatus, cards } = props;

    //// This will only happen over the empty (bottom) portions of a column. BoardCard will handle when hovering happens over a list.
    //if (overStatus !== draggedStatus && monitor.isOver({shallow: true})) {
      //const from = {id: draggedId, status: draggedStatus};
      //const to = {index: cards.length, status: overStatus};

      //props.moveCard(from, to);

      //if(draggedStatus !== overStatus) {
        //// So I think this might actually be frowned upon (mutating here)... but it works for now.
        //monitor.getItem().currentStatus = overStatus;
      //}
    //}
  //}
};

@DropTarget(DragItemTypes.BOARDCARD, columnTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
@Radium
class CardList extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired
  };

  render() {
    const { connectDropTarget, isOver } = this.props;
    const { cardList } = this.props;
    let cards = cardList.cards.edges.map(({node}) => node);
    cards = cards.sort((a, b) => {
      if (a.cardListRank >= b.cardListRank) {
        return 1;
      }
      if (a.cardListRank < b.cardListRank) {
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
};

export default Relay.createContainer(CardList, {
  prepareVariables() {
    return {
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991
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
