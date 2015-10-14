import { IndexLink, Link } from 'react-router'

export default function Navigation(props) {
  return (
    <div className="navbar navbar-inverse navbar-fixed-top">
      <IndexLink className="navbar-brand" to="/">{props.projectName}</IndexLink>
    </div>
  );
}
