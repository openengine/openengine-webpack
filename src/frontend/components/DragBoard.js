import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import update from 'react/lib/update';
import Relay from 'react-relay';
import TextField from 'material-ui/lib/text-field'
import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import Card from './BoardCard'
import CardList from "./CardList"
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const styles = {
  container: {
    fontFamily: 'Roboto, sans-serif',
    background: '#00ccaa'
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
    alignItems: 'stretch'
  },

  boardHeader: {
    flex: '1 0 auto',
    fontSize:'1.0rem',
    fontWeight:100,
    color: '#9E9E9E'
  },

  boardSearchbox: {
    paddingTop: '20px'
  },

  boardNmae: {
    fontSize: '1.5rem',
    fontWeight:100,
    color: '#9E9E9E',
    marginBottom: 40
  },

  boardSearchIcon: {
    position: 'relative',
    bottom: -5
  }
};


// Right... so we need to seperate out this component because the Drag and Drop context will only work with the default exported class...
// And therefore, a Relay Container (as far as I know), will not work directly with React Dnd...
@DragDropContext(HTML5Backend)
@Radium
export default class DragBoard extends React.Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.findCard = this.findCard.bind(this);
    const { board } = this.props;
  }

  moveCard(from, to) {
    const { card, status, index } = this.findCard(from.id, from.status);

    if(card) {
      // I know there's a way to consolidate these two calls... but not sure how
      this.setState(update(this.state, {
        cards: {[from.status] : {$splice:[[index, 1]]}
        }
      }));

      this.setState(update(this.state, {
        cards: {[to.status]: {$splice:[[to.index, 0, card]]}
        }
      }));
    }
  }

  findCard(id, status) {
    const { cards } = this.state;
    const card = cards[status].filter(c => c.id === id)[0];

    return {
      card,
      status,
      index: cards[status].indexOf(card)
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
              cardList={node}
              moveCard={this.moveCard}
              findCard={this.findCard}
            />
          )}
        </div>
      </div>
    );
  }
};
