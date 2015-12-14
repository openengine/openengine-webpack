import React, { PropTypes } from 'react';
import Radium from 'radium';
import Relay from 'react-relay';
import BoardCard from './BoardCard';
import { DragItemTypes } from '../constants';
import { DropTarget } from 'react-dnd';
import {
FlatButton,
FontIcon,
Paper,
TextField,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import MoveCardMutation from '../mutations/MoveCardMutation';
import RemoveCardMutation from '../mutations/RemoveCardMutation';
import AddCardMutation from '../mutations/AddCardMutation';
const styles = {
  headerRowContainer: (viewType)=> ({
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: viewType === 'grid' ? 'center' : 'flex-start',
    paddingLeft: viewType === 'grid' ? 0 : '1.0rem',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
  }),
  columnContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: '1 0 auto',
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
  boardColumnContainer: (isOver, viewType) => ({
    minHeight: viewType === 'grid' ? 500 : 20,
    boxShadow: (isOver ? '0px -1px 0px 1px #90A4AE' : '0px 0px 0px 0px #90A4AE'),
  }),
  addCardBtnHolder: {
    alignSelf: 'stretch',
    textAlign: 'center',
    flex: '1 1 100%',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    marginBottom: '1.0rem',
  },
  addCardBtn: {
    backgroundColor: Colors.grey50,
    borderRadius: 20,
    verticalAlign: 'middle',
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  addCardBtnIcon: {
    verticalAlign: 'middle',
    left: '1.0rem',
    fontSize: '0.9rem',
    color: Colors.grey400,
  },
  addCardBtnLabel: {
    color: Colors.grey400,
    fontSize: '0.8rem',
    fontWeight: 400,
    verticalAlign: 'middle',
    textTransform: 'none',
    textAlign: 'center',
  },
  addCardTmp: (viewType, opened)=>({
    opacity: opened ? 1 : 0,
    height: opened ? 'auto' : 0,
    borderRadius: 5,
    marginBottom: (viewType === 'grid' && opened) ? '1.0rem' : '0.2rem',
    marginRight: '0.5rem',
    marginLeft: '0.5rem',
    minHeight: (viewType === 'grid' && opened) ? 100 : 0,
    padding: (viewType === 'grid' && opened) ? 10 : '2px 5px 2px 15px',
    boxShadow: '0 0px 2px rgba(0, 0, 0, 0.15)',
  }),
};

// Used to sort cards in a boardColumn by the specified field
const sortCards = (boardColumn, sortBy) => {
  return boardColumn.cards ? boardColumn.cards.edges.map(({node}) => node).sort((cardA, cardB) => {
    if (cardA[sortBy] >= cardB[sortBy]) {
      return 1;
    }
    if (cardA[sortBy] < cardB[sortBy]) {
      return -1;
    }
  }) : [];
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
    viewType: PropTypes.string,
    toggleCardDetails: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.addCardInit = this.addCardInit.bind(this);
    this.addCard = this.addCard.bind(this);
    this.addCardBlur = this.addCardBlur.bind(this);
    this.state = {addOpened: false};
  }
  addCard() {
    this.setState({addOpened: false});
    const { boardColumn } = this.props;
    const cards = sortCards(boardColumn, 'rank');
    let rank = 0;
    if (cards.length > 0) {
      rank = cards[cards.length - 1].rank + 1;
    }
    // Add card to this board column
    Relay.Store.update(
      new AddCardMutation({
        boardColumn: boardColumn,
        name: this._addCardName.getValue(),
        description: '',
        rank: rank,
      })
    );
    this._addCardName.clearValue();
    this._addCardName.blur();
  }
  addCardInit() {
    this.setState({addOpened: true});
    this._addCardName.focus();
  }
  addCardBlur() {
    this.setState({addOpened: false});
  }
  render() {
    const { connectDropTarget, isOver, isOverOnly, draggedItem } = this.props;
    const { boardColumn, viewType, toggleCardDetails } = this.props;
    const { addOpened } = this.state;
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
        <div style={[styles.headerRowContainer(viewType)]}>
          <div style={[styles.boardColumnName]}>
            {boardColumn.name}
          </div>
        </div>
        <div style={[styles.columnContainer]}>
        {connectDropTarget(
          <div style={[styles.boardColumnContainer(isOver, viewType)]}>
            {cards.map(card => {
              return (
                <BoardCard
                  key={card.id}
                  card={card}
                  cardIndex={cards.indexOf(card)}
                  boardColumn={boardColumn}
                  viewType={viewType}
                  toggleCardDetails = {toggleCardDetails}
                />
              );
            })}
            {placeHolder}
            <Paper style={styles.addCardTmp(viewType, addOpened)} zDepth={0}>
              <TextField onEnterKeyDown={this.addCard} onBlur={this.addCardBlur} ref={(ref) => this._addCardName = ref} underlineStyle={{borderColor: 'transparent'}}
              underlineFocusStyle={{borderColor: Colors.brown50}} hintText= "What you working on?"
                multiLine fullWidth />
            </Paper>
            <div style={styles.addCardBtnHolder}>
              <FlatButton onClick={this.addCardInit} fullWidth style={styles.addCardBtn} labelStyle={styles.addCardBtnLabel}
              label="add card" labelPosition="after"><FontIcon style={styles.addCardBtnIcon} className="material-icons">add</FontIcon></FlatButton>
            </div>
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
        ${RemoveCardMutation.getFragment('boardColumn')},
        ${AddCardMutation.getFragment('boardColumn')},
      }
    `,
  },
});
