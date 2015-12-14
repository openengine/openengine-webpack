import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import {
  Avatar,
  Paper,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import { Link } from 'react-router';
import Radium, { Style }  from 'radium';
const styles = {
  boardListing: {
    padding: 10,
    cursor: 'pointer',
  },
  boardListName: {
    marginLeft: 5,
    fontSize: '1.3em',
    fontWeight: 'lighter',
    display: 'inline-block',
  },
};
@Radium
class BoardList extends React.Component {
  static propTypes = {
    viewer: PropTypes.object,
  };
  render() {
    const { viewer } = this.props;
    const { boards } = viewer;
    const aStyle = (<Style
      rules={{
        a: {
          textDecoration: 'none',
          color: '#455A64',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 'lighter',
        },
      }}
    />);
    return (
      <div>
        {aStyle}
        <div className="container-fluid">
          {boards.edges.map(({node}) =>
            <Link to={`/board/${node.id}`} key={node.id}>
              <Paper zDepth={1} rounded={false} style={styles.boardListing}>
                <Avatar color={Colors.amber800} backgroundColor={Colors.green100}>{node.name.charAt(0)}</Avatar>
                <h2 style={styles.boardListName}>{node.name}</h2>
              </Paper>
            </Link>
          )}
        </div>
      </div>
    );
  }
}
export default Relay.createContainer(BoardList, {
  initialVariables: {
    status: null,
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
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991,
    };
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        boards(first: $limit) {
          edges {
            node {
              id
              name
            }
          }
        },
      }
    `,
  },
});
