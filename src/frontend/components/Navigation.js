import { IndexLink, Link } from 'react-router'

const AppBar = require('material-ui/lib/app-bar');

export default function Navigation(props) {
  return (
    <AppBar
      iconElementLeft={<IndexLink to="/"><img src={'/img/engine_logo_4.svg'} width="160" /></IndexLink>}
      style={{background: 'none',  boxShadow: 'none'}}
    />
  );
}
