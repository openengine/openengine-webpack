import React from 'react';
import Radium from 'radium';
import Relay from 'react-relay';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'
import Colors from 'material-ui/lib/styles/colors'
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field'
import IconButton from 'material-ui/lib/icon-button';
import { Link } from 'react-router'

// Inline JS Styles
const styles = {
    flexContainer: {
      fontFamily: 'Roboto, sans-serif',
      background: '#FFFFFF'
    },

    flexRowContainer: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'stretch',
      overflow: 'hidden',
      width: '100%',
      padding: 3,
      minHeight: 550
    },

    flexHeaderRowContainer: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'stretch',
      overflow: 'hidden',
      width: '100%',
      padding: 3
    },

    flexColumnContainer: {
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
      alignItems: 'stretch'
    },

    flexBoardColumn: {
      width:'33%',
      flex: '1 0 auto',
      boxShadow: '0 0px 2px rgba(0, 0, 0, 0.15)'
    },

    flexBoardHeader: {
      flex: '1 0 auto',
      fontSize:'1.0rem',
      fontWeight:100,
      color: '#9E9E9E'
    },

    flexBoardSearchbox: {
      paddingTop: '20px'
    },

    boardTitle: {
      fontSize: '1.5rem',
      fontWeight:100,
      color: '#9E9E9E',
      marginBottom: 40
    },

    boardSearchIcon: {
      position: 'relative',
      bottom: -5
    }
};

@Radium
class FullCard extends React.Component {
  render() {
    const {card} = this.props;
    
    const outerStyle = {
        position: 'absolute',
        width:'100%',
        height:'100%',
        top:0, bottom:0, left:0, right:0,
        marginTop:4,
        boxShadow: '0px 0px 0px 4px ' + Colors.purple600,
        borderTop: 'solid 6px ' + Colors.greenA700
    };

    const featuresStyle = {
        backgroundColor: '#FDFDFE',
        height: 800,
        boxShadow: '0 0px 2px rgba(0, 0, 0, 0.15)'
     };

    return (
      <div style={outerStyle}>
        <div style={[styles.flexContainer]}>
          <div style={[styles.flexRowContainer]}>
            <div style={[styles.flexRowContainer, {width:'80%'}]} type='Content'>
              <div style={[styles.flexHeaderRowContainer]}>
                  <IconButton onClick={()=> this.props.history.goBack()} style={{cursor:'pointer'}} iconClassName="material-icons" iconStyle = {{color: Colors.blueGrey100}}>close</IconButton>
                  <div style={[styles.flexBoardHeader, {marginLeft:20}]}>
                     <h2 style={[styles.boardTitle]}>{card.title}</h2>
                  </div>
                  <div style={[styles.flexBoardHeader, styles.flexBoardSearchbox]}>
                      <TextField
                        hintText={<span><i style={[styles.boardSearchIcon]} className="material-icons">search</i>Search...</span>}
                        hintStyle={{paddingBottom: 5}}
                        type="search" />
                  </div>
              </div>
               <div style={[styles.flexColumnContainer]} type='Notes'> 
                <Paper style={styles.flexBoardColumn} zDepth={0} rounded={false}>

                </Paper>
              </div>
              <div style={[styles.flexColumnContainer]} type='Comments'>
                <Paper style={styles.flexBoardColumn} zDepth={0} rounded={false}>

                </Paper>
               </div>
            </div>
            <div style={[styles.flexColumnContainer, featuresStyle, {width:'20%'}]} type='Features'>
              
            </div>
          </div>
        </div>
       </div>

    );
  }
};

export default Relay.createContainer(FullCard, {
  prepareVariables({status}) {
    return {
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991
    };
  },

  fragments: {
    card: () => Relay.QL`
      fragment on Card {
        title
      }
    `,
  },
});
