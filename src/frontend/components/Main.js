import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Navigation from './Navigation';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Main extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.object,
  };
  render() {
    const { pathname } = this.props.location;

    return (
      <div>
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
