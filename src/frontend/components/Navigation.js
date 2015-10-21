import { IndexLink, Link } from 'react-router'

const AppBar = require('material-ui/lib/app-bar');

export default function Navigation(props) {
  return (
<AppBar title={props.projectName} iconElementLeft={<IndexLink to="/"><img src={'img/engine_logo.svg'} /></IndexLink>} />
  );
}
