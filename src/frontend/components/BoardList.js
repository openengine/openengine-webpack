import React from 'react';
import Relay from 'react-relay';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'
import Colors from 'material-ui/lib/styles/colors'

class BoardList extends React.Component {
  renderBoards() {
    const {viewer} = this.props;

    return viewer.boards.edges.map(({node}) =>

      <Card key={node.id} initiallyExpanded={false}>
        <CardHeader
          title={node.title}
          subtitle= "A Nice Board"
          avatar={<Avatar color={Colors.amber800} backgroundColor={Colors.green100}>{node.title.charAt(0)}</Avatar>}
          actAsExpander={true}
          showExpandableButton={true}>
        </CardHeader>
        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions expandable={true}>
          <FlatButton label="Action1"/>
          <FlatButton label="Action2"/>
        </CardActions>
      </Card>
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
              title
            }
          }
        },
      }
    `,
  },
});
