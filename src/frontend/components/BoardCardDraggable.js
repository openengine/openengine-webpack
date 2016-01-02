import React, {
  Component,
  PropTypes,
} from 'react';
import Radium from 'radium';
import { findDOMNode } from 'react-dom';
import Relay from 'react-relay';
import {
  Paper,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import { DragItemTypes } from '../constants';
import {
  DragSource,
} from 'react-dnd';
import {Motion, spring} from 'react-motion';
import CardDetails from './CardDetails';
import MoveCardMutation from '../mutations/MoveCardMutation';
const styles = {
  cardName: {
    fontSize: '0.9rem',
    fontWeight: 300,
    color: Colors.grey700,
    textAlign: 'left',
    wordWrap: 'normal',
    wordBreak: 'normal',
    overflow: 'auto',
    maxWidth: '100%',
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
      index: props.cardIndex,
    };
  },
  endDrag(props, monitor, component) {
    if (monitor.didDrop()) {
      const { droppedOnBoardColumn, droppedOnCardIndex } = monitor.getDropResult();
      component.setState({hasDropped: true, droppedOnBoardColumn: droppedOnBoardColumn, droppedOnCardIndex: droppedOnCardIndex });
    }
  },
};

@DragSource(DragItemTypes.BOARDCARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
@Radium
class BoardCardDraggable extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    card: PropTypes.object,
    cardIndex: PropTypes.number,
    boardColumn: PropTypes.object,
    isDragging: PropTypes.bool,
    viewType: PropTypes.string,
    toggleCardDetails: PropTypes.func,
    style: PropTypes.object,
    setStyle: PropTypes.func,
    isOverSelf: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.cardClicked = this.cardClicked.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.state = {isPressed: false, isTheDragged: false, hasDropped: false, droppedOnBoardColumn: null, droppedOnCardIndex: null};
  }
  componentDidMount() {
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mouseup', this.handleMouseUp);
  }
  componentWillReceiveProps(nextProps) {
    const {card, setStyle, viewType} = this.props;
    const paperHeight = findDOMNode(this._paper).offsetHeight;
    // If the reference height is less than the height of the actual boardCard and its content,
    // then set the reference height to the new boardCard height
    if (viewType === 'grid' && nextProps.style.dataHeight < paperHeight) {
      setStyle(card, paperHeight);
    }
    this.setState({isPressed: false});
  }
  componentWillUnmount() {
    this.setState({isPressed: false});
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
  cardClicked() {
    this.props.toggleCardDetails(this.props.card);
  }
  handleTouchStart() {
    this.handleMouseDown();
  }
  handleMouseDown() {
    this.setState({ isPressed: true});
  }
  handleMouseUp() {
    this.setState({isPressed: false});
  }
  render() {
    const { card, isDragging, connectDragSource, viewType, style, isOverSelf, boardColumn} = this.props;
    const { isPressed, hasDropped, droppedOnBoardColumn } = this.state;

    // configuration for our animations
    const springConfig = [300, 50];

    let cardStyle = { // The default animation style for all our cards
      scale: spring(1, springConfig),
      shadow: spring(1, springConfig),
      opacity: style.opacity,
      borderWidth: spring(0, springConfig),
      height: style.height,
    };

    // ******* DragSource Animatin Styles (when the card in question is being dragged)
    if (isPressed) {
      cardStyle = {
        scale: viewType === 'grid' ? spring(1.1, springConfig) : spring(1.01, springConfig),
        shadow: spring(16, springConfig),
        opacity: spring(1, springConfig),
        borderWidth: spring(0, springConfig),
        height: style.height,
      };
    }

    if (isDragging) {
      cardStyle = {
        scale: spring(1, springConfig),
        shadow: spring(0, springConfig),
        opacity: spring(0, springConfig),
        borderWidth: spring(2, springConfig),
        height: style.height,
      };
    }

    if (hasDropped && droppedOnBoardColumn && droppedOnBoardColumn.id !== boardColumn.id) {
      cardStyle = {
        scale: spring(1, springConfig),
        shadow: spring(0, springConfig),
        opacity: spring(0, springConfig),
        borderWidth: spring(0, springConfig),
        height: spring(0, springConfig),
      };
    }
    // ****** END DRAG SOURCE ANIMATION STYLING

    let bgColor = Colors.white;
    if (isDragging) {
      bgColor = 'transparent';
    }
    if (isOverSelf) {
      bgColor = Colors.blueGrey100;
    }
    return connectDragSource(
      <div>
        <Motion style={cardStyle} key={card.id}>
              {({scale, shadow, borderWidth, opacity, height}) =>
              <div>
                <div
                  onMouseDown={this.handleMouseDown}
                  onMouseUp={this.handleMouseUp}
                  onTouchEnd={this.handleMouseUp}
                  onTouchStart={this.handleTouchStart}
                  ref={(ref) => this._wholeMotion = ref}
                  style={{
                    cursor: isDragging ? 'grabbing' : 'pointer',
                    height: viewType === 'grid' ? height : 'auto',
                    paddingBottom: style.paddingBottom,
                    paddingTop: style.paddingTop,
                  }}>
                  <Paper ref={(ref) => this._paper = ref} onClick={this.cardClicked} style={{
                    borderRadius: 5,
                    backgroundColor: bgColor,
                    borderWidth: borderWidth,
                    borderStyle: 'dotted',
                    borderColor: Colors.blueGrey100,
                    marginBottom: viewType === 'grid' ? '1.0rem' : '0.2rem',
                    marginRight: '0.5rem',
                    marginLeft: '0.5rem',
                    minHeight: viewType === 'grid' ? 100 : 0,
                    padding: viewType === 'grid' ? 10 : '2px 5px 2px 15px',
                    flex: '1 0 auto',
                    boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                    transform: `scale(${scale})`,
                    WebkitTransform: `scale(${scale})`,
                  }} zDepth={0}>
                    <div style={{ opacity: opacity }}>
                      <h1 style={styles.cardName}>{card.name}</h1>
                    </div>
                  </Paper>
                </div>
              </div>
              }
        </Motion>
      </div>
    );
  }
}
export default Relay.createContainer(BoardCardDraggable, {
  fragments: {
    card: () => Relay.QL`
      fragment on Card {
        id
        name
        assignedTo
        rank
        ${CardDetails.getFragment('card')}
        ${MoveCardMutation.getFragment('card')},
      }
    `,
  },
});
