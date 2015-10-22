import Relay from 'react-relay';
import Navigation from './Navigation';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

let Main = (props) => {
  const { pathname } = props.location

  return (
    <div>
      <Navigation projectName="Engine" />
      <ReactCSSTransitionGroup component="div" transitionName="board" transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionLeave={false}>
        {React.cloneElement(props.children || <div />, { key: pathname })}
        </ReactCSSTransitionGroup>
    </div>
  );
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
