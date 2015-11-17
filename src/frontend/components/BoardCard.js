import React, {
  Component,
  PropTypes,
} from 'react';
import Radium from 'radium';
import { findDOMNode } from 'react-dom';
import Relay from 'react-relay';
import MaterialCard from 'material-ui/lib/card/card';
import {
  CardHeader,
  Avatar,
  IconMenu,
  IconButton,
  FontIcon,
} from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Colors from 'material-ui/lib/styles/colors';
import { Link } from 'react-router';
import { DragItemTypes } from '../constants';
import {
  DragSource,
  DropTarget,
} from 'react-dnd';
import MoveCardMutation from '../mutations/MoveCardMutation';
import DeleteCardMutation from '../mutations/DeleteCardMutation';
const styles = {
  avatar: {
    float: 'right',
    fontSize: '1.0rem',
    fontWeight: 300,
  },
  optionsMenuContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    padding: 0,
    margin: 0,
  },
  optionsMenu: {
    padding: 0,
    margin: 0,

  },
};
const cardSource = {
  beginDrag(props, monitor, component) {
    // Send the height of the dragged card to show the correct sized placeHolder
    const height = findDOMNode(component).offsetHeight;
    return {
      card: props.card,
      boardColumn: props.boardColumn,
      height: height,
    };
  },
};
const cardTarget = {
  canDrop(props, monitor) {
    const { card } = monitor.getItem();
    if (card.id === props.card.id) {
      return false;
    }
    return true;
  },
  // If a card is dropped on another card, send that card's listRank to the boardColumn drop event
  drop(props) {
    return {
      droppedOnCardRank: props.card.boardColumnRank,
      droppedOnCardIndex: props.cardIndex,
    };
  },
};

@DropTarget(DragItemTypes.BOARDCARD, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  draggedItem: monitor.getItem(),
}))
@DragSource(DragItemTypes.BOARDCARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
@Radium
export default class BoardCard extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    card: PropTypes.object,
    cardIndex: PropTypes.number,
    boardColumn: PropTypes.object,
    isDragging: PropTypes.bool,
    isOver: PropTypes.bool,
    draggedItem: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.cardMenuSelected = this.cardMenuSelected.bind(this);
    this.state = {optionsExpanded: false};
  }
  cardMenuSelected(event, item) {
    switch (item.props.value) {
    case 'delete':
      Relay.Store.update(
      new DeleteCardMutation({
        boardColumn: this.props.boardColumn,
        card: this.props.card,
      })
    );
      break;
    default:

    }
  }
  render() {
    const { card, isDragging, isOver, draggedItem, connectDragSource, connectDropTarget } = this.props;
    let avatar = '?';
    if (card.assignedTo) {
      const splitName = card.assignedTo.split(' ');
      if (splitName.length > 1) {
        avatar = splitName[0][0] + splitName[1][0];
      } else {
        if (splitName.length === 1) {
          avatar = card.assignedTo.substring(0, 2);
        }
      }
    }
    // We will put the placeholder in when a card is hovering over this card. Always above since below
    // will be taken care of by the BoardColumn parent component (only on empty or below last card)
    let placeHolder = '';
    // if there is a draggedItem that is picked up by the "dropMonitor" put in the placeHolder
    if (draggedItem) {
      placeHolder = (
        <div style={{
          display: isOver ? 'block' : 'none',
          width: '100%',
          height: draggedItem.height,
          background: Colors.blueGrey50,
        }}/>
    );
    }

    const menuIcon = (<IconButton iconStyle={{color: Colors.grey500}} onTouchTap={this.optionsExpandClick} tooltip="show/hide card options" tooltipPosition="bottom-left">
      <FontIcon className="material-icons">more_vert</FontIcon>
    </IconButton>);
    return connectDragSource(connectDropTarget(
      <div style={{
        display: isDragging ? 'none' : 'block',
        cursor: 'move',
      }}>
      {placeHolder}
        <MaterialCard initiallyExpanded={false}>
          <CardHeader
            title={<Link to={`/card/${card.id}`}>{card.name}</Link>}
            titleStyle={{cursor: 'pointer'}}
            textStyle = {{display: 'block'}}
            avatar={<div><Avatar style={styles.avatar} backgroundColor={card.assignedTo ? Colors.greenA700 : Colors.grey500}>{avatar}</Avatar></div> }
            actAsExpander={false}
            showExpandableButton={false}>
              <IconMenu style={styles.optionsMenuContainer} menuStyle={styles.optionsMenu} onItemTouchTap={this.cardMenuSelected} iconButtonElement={menuIcon}>
                 <MenuItem value="delete" innerDivStyle={{paddingLeft: 40}} style={{fontSize: '0.9rem'}} key={'delete_' + card.id} index={0} primaryText="Delete" leftIcon={<FontIcon style={{paddingLeft: 0}} className="material-icons">delete</FontIcon>} />
              </IconMenu>
          </CardHeader>
        </MaterialCard>
      </div>
    ));
  }
}
export default Relay.createContainer(BoardCard, {
  fragments: {
    card: () => Relay.QL`
      fragment on Card {
        id
        name
        assignedTo
        boardColumnRank
        ${MoveCardMutation.getFragment('card')},
        ${DeleteCardMutation.getFragment('card')},
      }
    `,
  },
});
