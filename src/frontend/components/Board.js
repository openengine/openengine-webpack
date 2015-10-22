import React from 'react';
import Relay from 'react-relay';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'
import Colors from 'material-ui/lib/styles/colors'

class Board extends React.Component {
  render() {
    const board = this.props.board;

    return (
      <div>
        <div className="container-fluid">               
            <Card initiallyExpanded={true}>
              <CardHeader
                title={board.title}
                subtitle= "A Nice Board"
                avatar={<Avatar color={Colors.amber800} backgroundColor={Colors.green100}>{board.title.charAt(0)}</Avatar>}
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
        </div>
      </div>
    );
  }
};

export default Relay.createContainer(Board, {
  fragments: {
    board: () => Relay.QL`
      fragment on Board {
        title
      }
    `,
  },
});
