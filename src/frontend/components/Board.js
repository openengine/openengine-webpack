import React from 'react';
import Relay from 'react-relay';
import DragBoard from './DragBoard'

class Board extends React.Component {

  render() {
    const {board} = this.props;
    return (
      
       // Right... so we need to seperate out this component because the Drag and Drop context will only work with the default exported "Component" class...
       // And therefore, an exported Relay Container (as far as I know), will not work directly with React Dnd...
        <DragBoard board={board} />
    );
  }
};

export default Relay.createContainer(Board, {
  prepareVariables({status}) {
    return {
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991
    };
  },

  fragments: {
    board: () => Relay.QL`
      fragment on Board {
        title
        cards(first: $limit) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `,
  },
});
