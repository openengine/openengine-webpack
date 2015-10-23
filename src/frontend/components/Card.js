import React from 'react';
import Relay from 'react-relay';
import MaterialCard from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'
import TextField from 'material-ui/lib/text-field'
import Colors from 'material-ui/lib/styles/colors'
import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import LinearProgress from 'material-ui/lib/linear-progress.js'

export default function Card(props) {
    return (
      <div>
          <MaterialCard initiallyExpanded={false}>
            <CardHeader
              title="Title"
              subtitle="Subtitle"
              avatar={<Avatar src="https://s3.amazonaws.com/uifaces/faces/twitter/sauro/48.jpg" style={{float:'right'}}></Avatar>}
              actAsExpander={true}
              showExpandableButton={false}>
            </CardHeader>
            <CardText expandable={false}>
               <LinearProgress style={{width:'50%', display:'inline-block'}} mode="determinate" value={60} /> <FontIcon color={Colors.green500} className="material-icons">done_all</FontIcon>
            </CardText>
            <CardActions expandable={true}>
              <FlatButton label="Action1"/>
              <FlatButton label="Action2"/>
            </CardActions>
            <CardText expandable={true}>
              Lorem ipsum dolor sit amet consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris mattis quis lacus id, pellentesque lobortis odio.
            </CardText>
          </MaterialCard>
        </div>
    );
};

// export default Relay.createContainer(Card, {
//   fragments: {
//     card: () => Relay.QL`
//       fragment on Card {
//         title
//       }
//     `,
//   },
// });


