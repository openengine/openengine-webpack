import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-scroll';

const styles = {
  tab: {
    paddingLeft: 20,
    paddingRight: 20,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

@Radium
export default class NotesTab extends React.Component {
  static propTypes = {
    headerOffset: PropTypes.number,
    linkTo: PropTypes.string.isRequired,
    children: PropTypes.string,
  };
  render() {
    const {headerOffset, linkTo} = this.props;

    return (
       <div className="notes_tabs" style={styles.tab}><Link to={linkTo} spy smooth offset={headerOffset} duration={400}>{this.props.children}</Link></div>
    );
  }
}
