import React, { PropTypes } from 'react';
import Radium from 'radium';
import {
  FontIcon,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';

const styles = {

  floatingBtn: {
    backgroundColor: Colors.tealA700,
    width: 60,
    height: 60,
    borderRadius: '50%',
    boxShadow: '2px 2px 7px -1px rgba(0, 0, 0, 0.5)',
    border: 'none',
    outline: 'none',
    transition: '.2s cubic-bezier(.4,0,.2,1)',
    ':hover': {
      cursor: 'pointer',
      boxShadow: '2px 4px 7px 0px rgba(0, 0, 0, 0.6)',
    },
    ':active': {
      backgroundColor: Colors.tealA400,
      boxShadow: '1px 3px 7px 0px rgba(0, 0, 0, 0.6)',
    },
  },
  floatingIcon: {
    position: 'absolute',
    marginLeft: 14,
    marginTop: 14,
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    backgroundSize: 'contain',
    transition: '.2s cubic-bezier(.4,0,.2,1)',
  },
  pen: (isHover) => ({
    opacity: (isHover ? 1 : 0),
    transform: (isHover ? 'rotate(0deg)' : 'rotate(125deg)'),
  }),
  plus: (isHover) => ({
    opacity: (isHover ? 0 : 1),
    transform: (isHover ? 'rotate(-125deg)' : 'rotate(0deg)'),
  }),
  insideIcon: {
    color: '#FFFFFF',
    fontSize: '2.0rem',
  },
};

@Radium
export default class SpinButton extends React.Component {
  static propTypes = {
    mouseEnter: PropTypes.func,
    btnStyle: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }

  render() {
    const { mouseEnter, btnStyle } = this.props;
    const isAddHover = Radium.getState(this.state, 'addFloatButton', ':hover');
    return (
      <button onMouseEnter={mouseEnter} key="addFloatButton" style={[styles.floatingBtn, btnStyle]}>
       <div key={1} style={[styles.floatingIcon, styles.pen(isAddHover)]}><FontIcon style={styles.insideIcon} className="material-icons">picture_in_picture</FontIcon></div>
       <div key={2} style={[styles.floatingIcon, styles.plus(isAddHover)]}><FontIcon style={styles.insideIcon} className="material-icons">add</FontIcon></div>
      </button>
    );
  }
}
