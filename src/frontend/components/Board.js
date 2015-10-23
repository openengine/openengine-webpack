import React from 'react';
import Relay from 'react-relay';
import TextField from 'material-ui/lib/text-field'
import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import Card from './Card'

class Board extends React.Component {
  render() {
    const board = this.props.board;

    return (
      <div className="flex-board">
        <div className="flex-column-container">
          <div className="flex-header-row-container">
            <div className="flex-board-header">
               <h2 className="board-title">{board.title}</h2>
              </div>
              <div className="flex-board-header flex-board-searchbox">
                  <TextField
                    hintText={<span><i className="material-icons board-search-icon">search</i>Search...</span>}
                    hintStyle={{paddingBottom: 5}}
                    type="search" />
              </div>
          </div>
          <div className="flex-header-row-container">
            <div className="flex-board-header">
              To Do
            </div>
            <div className="flex-board-header">
              Doing
            </div>
            <div className="flex-board-header">
              Done
            </div>
          </div>
          <div className="flex-row-container">
            <Paper className="flex-board-column" zDepth={0} rounded={false}>
                <Card />
                 <Card />
            </Paper>
             <Paper className="flex-board-column" zDepth={0} rounded={false}>
              <Card />
            </Paper>
             <Paper className="flex-board-column" zDepth={0} rounded={false}>
          
            </Paper>
          </div>
        </div>
      </div>
    );
  }
};

export default Relay.createContainer(Board, {
  fragments: {
    board: () => Relay.QL`
      fragment on Board {
        title
      }
    `,
  },
});
