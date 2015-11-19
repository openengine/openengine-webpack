import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import DragBoard from './DragBoard';
import BoardColumn from './BoardColumn';
import AddCardMutation from '../mutations/AddCardMutation';

class Board extends React.Component {
  static propTypes = {
    board: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
  };
  render() {
    const {board, viewer} = this.props;
    return (
      // Right... so we need to seperate out this component because the Drag and Drop context will only work with the default exported "Component" class...
      // And therefore, an exported Relay Container (as far as I know), will not work directly with React Dnd...
      <DragBoard board={board} viewer={viewer} />
    );
  }
}

export default Relay.createContainer(Board, {
  prepareVariables({}) {
    return {
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991,
    };
  },

  fragments: {
    board: () => Relay.QL`
      fragment on Board {
        name
        columns(first: $limit) {
          edges {
            node {
              id
              ${BoardColumn.getFragment('boardColumn')},
              ${AddCardMutation.getFragment('boardColumn')},
            }
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        users {
          id
          name
        }
      }
    `,
  },
});
