import React from 'react';
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
import { Link } from 'react-router'

class FullCard extends React.Component {

  render() {
    const {card} = this.props;
    const outerStyle = {
        position: 'absolute',
        width:'100%',
        height:'100%',
        top:0, bottom:0, left:0, right:0,
        marginTop:4,
        boxShadow: '0px 0px 0px 4px' + Colors.purple600,
        borderTop: 'solid 6px' + Colors.greenA700
    };
    return (
      <div style={outerStyle}>
        <div className="flex-board">
          <div className="flex-column-container">
            <div className="flex-header-row-container">
              <div className="flex-board-header">
                 <h2 className="board-title">{card.title}</h2>
                </div>
                <div className="flex-board-header flex-board-searchbox">
                    <TextField
                      hintText={<span><i className="material-icons board-search-icon">search</i>Search...</span>}
                      hintStyle={{paddingBottom: 5}}
                      type="search" />
                </div>
            </div>
            <div className="flex-row-container">
              <Paper className="flex-board-column" zDepth={0} rounded={false}>

              </Paper>
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
