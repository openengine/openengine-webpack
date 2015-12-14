import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Navigation from './Navigation';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Radium, { Style }  from 'radium';
@Radium
class Main extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.object,
  };
  render() {
    const { pathname } = this.props.location;
    const animStyle = (<Style
      rules={{
        '.board-enter': {
          opacity: 0.01,
          transition: 'opacity .5s ease-in',
        },
        '.board-enter.board-enter-active': {
          opacity: 1,
         /* transition: width 1s ease-in, height 1s ease-in;*/
        },
        '.board-leave': {
          opacity: 1,
          transition: 'opacity .3s ease-in',
        },
        '.board-leave.board-leave-active': {
          opacity: 0,
        },
      }}
    />);
    return (
      <div>
        {animStyle}
        <Navigation projectName="Engine" />
        <ReactCSSTransitionGroup
          component="div"
          transitionName="board"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          transitionLeave={false} >
          {React.cloneElement(this.props.children || <div />, { key: pathname })}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default Relay.createContainer(Main, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
});
