import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Colors from 'material-ui/lib/styles/colors';
import {Link} from 'react-scroll';

const styles = {
  tab:{
    paddingLeft: 20,
    paddingRight: 20
  }
}

@Radium
export default class NotesTab extends React.Component {  

  static propTypes = {
    headerOffset: PropTypes.number,
    linkTo: PropTypes.string.isRequired
  };
  render() {
    const {headerOffset, linkTo, isActive} = this.props;

    return (
       <div style={styles.tab}><Link to={linkTo} spy={true} smooth={true} offset={headerOffset} duration={400}>{this.props.children}</Link></div>
    );
  }
};