import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import MaterialCard from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import Avatar from 'material-ui/lib/avatar'
import FontIcon from 'material-ui/lib/font-icon';
import { Link } from 'react-router'
import { DragItemTypes } from "../constants"
import { DragSource } from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    console.log('BoardCard#beginDrag', props);
    return {
      card: props.card
    };
  },

  endDrag(props, monitor) {
    console.log('BoardCard#endDrag', monitor.didDrop(), props, monitor, monitor.getDropResult());
    const { id: droppedId, originalStatus, currentStatus, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();
    const dropColumn = monitor.getDropResult();

    // This means it was dropped outside of a dropzone... so put it back in its original spot
    if(!didDrop) {
      const from = {id: droppedId, status: currentStatus};
      const to = {index: originalIndex, status: originalStatus}
      props.moveCard(from, to);
    }
  }
};

@DragSource(DragItemTypes.BOARDCARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    //moveCard: PropTypes.func.isRequired,
    //findCard: PropTypes.func.isRequired
  };

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { card } = this.props;
    const { name, id } = card;

    return connectDragSource(
      <div style={{
          opacity: isDragging ? 0 : 1,
          cursor: 'move'
        }}>
        <MaterialCard initiallyExpanded={false}>
          <CardHeader
            title={<Link to={`/card/${id}`}>{name}</Link>}
            titleStyle={{cursor:'pointer'}}
            nameStyle = {{display:'block'}}
            avatar={<Avatar src="https://s3.amazonaws.com/uifaces/faces/twitter/sauro/48.jpg" style={{float:'right'}}></Avatar>}
            actAsExpander={false}
            showExpandableButton={false}>
          </CardHeader>
        </MaterialCard>
      </div>
    );
  }
};

export default Relay.createContainer(Card, {
  fragments: {
    card: () => Relay.QL`
      fragment on Card {
        id
        name
        cardListRank
      }
    `,
  },
});
