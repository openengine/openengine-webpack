import { IndexLink, Link } from 'react-router'

const AppBar = require('material-ui/lib/app-bar');

export default function Navigation(props) {
  return (
<AppBar title={props.projectName} iconElementLeft={<img src={'engine_logo.svg'} />} />
  );
}
