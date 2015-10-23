import { IndexLink, Link } from 'react-router'

const AppBar = require('material-ui/lib/app-bar');

export default function Navigation(props) {
  return (
    <AppBar
      title={<h1><IndexLink className="appBarTitle" to="/">{props.projectName}</IndexLink></h1>}
      iconElementLeft={<IndexLink to="/"><img src={'/img/engine_logo.svg'} /></IndexLink>}
      style={{background: 'none',  boxShadow: 'none'}}
    />
  );
}
