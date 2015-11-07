import React, { PropTypes } from 'react';
import Radium from 'radium';
import update from 'react/lib/update';
import { TextField } from 'material-ui';
import CardList from './CardList';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const styles = {
  container: {
    fontFamily: 'Roboto, sans-serif',
    background: '#fff',
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
  },

  boardHeader: {
    flex: '1 0 auto',
    fontSize: '1.0rem',
    fontWeight: 100,
    color: '#9E9E9E',
  },

  boardSearchbox: {
    paddingTop: '20px',
  },

  boardNmae: {
    fontSize: '1.5rem',
    fontWeight: 100,
    color: '#9E9E9E',
    marginBottom: 40,
  },

  boardSearchIcon: {
    position: 'relative',
    bottom: -5,
  },
};


// Right... so we need to seperate out this component because the Drag and Drop context will only work with the default exported class...
// And therefore, a Relay Container (as far as I know), will not work directly with React Dnd...
@DragDropContext(HTML5Backend)
@Radium
export default class DragBoard extends React.Component {
  static propTypes = {
    board: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.findCard = this.findCard.bind(this);
    const {cardLists} = this.props.board;
    // We need to set the state of the Board because we will be maniuplating the UI with hover, but we
    // don't want those changes to be propagated until the actual drop happens.
    this.state = {cardLists: cardLists.edges};
  }

  moveCard(from, to) {
    const fromCard = this.findCard(from.id, from.listId);
    const toCard = this.findCard(to.id, to.listId);

    const lowRank = toCard.index === 0 ? toCard.cardListRank - 1 : this.state.cardLists[to.listId][toCard.index - 1].cardListRank;

    const newRank = (toCard.cardListRank + lowRank) / 2;

    this.setState(update(this.state, {
      cardLists: {[from.listId]: {$splice: [[fromCard.index, 1]]},
      },
    }));

    fromCard.card.cardListRank = newRank;

    // Place in new list and rank
    this.setState(update(this.state, {
      cardsLists: {[to.listId]: {$splice: [[toCard.index, 0, fromCard.card]]},
    },
    }));

    // this.setState(update(this.state, {
    //   cardLists: {[from.listId]: {[from.id]: {cardListRank: {$set: 7}}},
    // },
    // }));

  //  const { card } = this.findCard(from.id, from.status);

  //  if (card) {
      // I know there's a way to consolidate these two calls... but not sure how
      // Remove from It's current list
      // this.setState(update(this.state, {
      //   cardLists: {[from.listId]: {$splice: [[card.cardListRank, 1]]},
      // },
      // }));
      // this.setState(update(this.state, {
      //   cardLists: {[from.listId]: {[from.id]: {cardListRank: {$set: 7}}},
      // },
      // }));
      //
      // // Place in new list and rank
      // this.setState(update(this.state, {
      //   cards: {[to.status]: {$splice: [[to.index, 0, card]]},
      // },
      // }));
  //  }
  }

  findCard(id, listId) {
    const { cardLists } = this.state;
    const card = cardLists.filter(crdList => crdList.id === listId).filter(crd => crd.id === id)[0];
    return {
      card,
      index: cardLists.filter(crdList => crdList.id === listId).indexOf(card),
    };
  }

  render() {
    const { board } = this.props;
    const { cardLists } = board;

    return (
      <div style={[styles.container]}>
        <div style={[styles.columnContainer]}>
          <div style={[styles.headerRowContainer]}>
            <div style={[styles.boardHeader]}>
              <h2 style={[styles.boardName]}>{board.name}</h2>
            </div>
            <div style={[styles.boardHeader, styles.boardSearchbox]}>
              <TextField
                hintText={<span><i style={[styles.boardSearchIcon]}
                className="material-icons">search</i>Search...</span>}
                hintStyle={{paddingBottom: 5}}
                type="search"
              />
            </div>
          </div>
        </div>
        <div style={[styles.rowContainer]}>
          {cardLists.edges.map(({node}) =>
            <CardList
              key={node.id}
              cardList={node}
              moveCard={this.moveCard}
              findCard={this.findCard}
            />
          )}
        </div>
      </div>
    );
  }
}
