import React, { PropTypes } from 'react';
import Radium from 'radium';
import {
  IconButton,
  FontIcon,
  Toolbar,
  ToolbarGroup,
  Paper,
} from 'material-ui';
import AssignMenu from './AssignMenu';
import Colors from 'material-ui/lib/styles/colors';
const styles = {
  container: (isOpen) => ({
    width: 'auto',
    padding: 10,
    whiteSpace: 'no wrap',
    overflow: 'visible',
    transition: 'all .4s ease-in-out',
    position: 'fixed',
    right: 0,
    top: 0,
    zIndex: 5,
    maxWidth: '50%',
    transform: isOpen ? 'translateX(-1%) translateZ(0px)' : 'translateX(100%) translateZ(0px)',
  }),
  lblName: {
    marginTop: '1.5rem',
    fontSize: '1.0rem',
    fontWeight: 400,
    color: Colors.grey700,
    textAlign: 'left',
    marginLeft: '0.2rem',
    marginRight: '2.0rem',
  },
  hr: {
    width: '100%',
    borderStyle: 'solid',
    borderColor: Colors.grey200,
    borderWidth: 1,
    borderTopStyle: 'none',
  },
  assignLbl: {
    fontSize: '0.8rem',
    color: Colors.grey400,
    fontWeight: 400,
    paddingBottom: 5,
    display: 'inline-block',
    marginLeft: 10,
  },
  icons: {
    color: Colors.grey300,
    lineHeight: '36px',
  },
};
@Radium
export default class CardDetails extends React.Component {
  static propTypes = {
    opened: PropTypes.bool,
    boardColumn: PropTypes.object,
    card: PropTypes.object,
    toggleCard: PropTypes.func,
    users: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.toggleCardDetails = this.toggleCardDetails.bind(this);
    this.openCardDetails = this.openCardDetails.bind(this);
    this.saveCard = this.saveCard.bind(this);
    this.state = {opened: false};
  }
  saveCard() {
  }
  openCardDetails() {
    if (!this.state.opened) {
      this.toggleCardDetails();
    }
  }
  toggleCardDetails() {
  //  this._details.toggle();
    this.setState({opened: !this.state.opened});
  }
  render() {
    const { opened } = this.state;
    const { card, users } = this.props;
    return (
      <Paper style={styles.container(opened)} ref={(ref) => this._details = ref}>
        <IconButton onClick={this.toggleCardDetails} style={{position: 'absolute', top: 0, right: 0}}>
          <FontIcon color={Colors.grey300} className="material-icons">close</FontIcon>
        </IconButton>
        <h1 style={styles.lblName}>{card ? card.name : ''}</h1>
        <hr style={styles.hr} />
        <Toolbar style={{backgroundColor: '#ffffff', paddingLeft: 0, overflow: 'visible'}}>
          <ToolbarGroup key={0} float="left">
            <AssignMenu ref={(ref) => this._assignMenu = ref} users={users} />
            <div style={styles.assignLbl}>Assign to</div>
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FontIcon style={styles.icons} className="material-icons">today</FontIcon>
            <FontIcon style={styles.icons} className="material-icons">attach_file</FontIcon>
            <FontIcon style={styles.icons} className="material-icons">delete</FontIcon>
          </ToolbarGroup>
        </Toolbar>
       </Paper>
    );
  }
}
