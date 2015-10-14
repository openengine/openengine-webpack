import React from 'react';
import Relay from 'react-relay';

class BoardList extends React.Component {
  renderBoards() {
    const {viewer} = this.props;

    return viewer.boards.edges.map(({node}) =>
      <h2>{node.text}</h2>
    );
  }

  render() {
    return (
      <div>
        <div className="container-fluid">
          <h1>BoardList</h1>
          {this.renderBoards()}
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(BoardList, {
  initialVariables: {
    status: null
  },

  prepareVariables({status}) {
    let nextStatus;
    if (status === 'active' || status === 'completed') {
      nextStatus = status;
    } else {
      // This matches the Backbone examples, which displays all todos on an
      // invalid route.
      nextStatus = 'any';
    }

    return {
      status: nextStatus,
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991
    };
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        boards(status: $status, first: $limit) {
          edges {
            node {
              id,
              text
            }
          }
        },
      }
    `,
  },
});
