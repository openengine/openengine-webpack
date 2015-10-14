import Relay from 'react-relay';
import Navigation from './Navigation';

let Main = (props) => {
  return (
    <div>
      <Navigation projectName="Engine" />
      {props.children}
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
