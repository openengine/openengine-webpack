import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import {Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, IconButton, FontIcon, Avatar} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors'

const styles = {

  listItem:{
    fontWeight: 300,
    fontSize:'0.8rem',
    color: Colors.grey600,
    lineHeight:'1.0rem'
  },

  avatar:{
    fontSize: '0.9rem'
  },

  chatIcon: {
      color: Colors.purple200,
      fontSize: '1.7rem'
  },

  chatIconText: {
    fontWeight: 500,
    fontFamily: 'Roboto, sans-serif',
    fontSize:'0.9rem',
    color: Colors.purple200,
    position:'relative',
    left: -5,
    top: -8
  },

  commentFull: {
    overflow: 'visible',
    height: 'auto',
    display: 'block'
  },

  commentMin: {
    overflow: 'hidden',
    height: 'auto',
    display: 'box'
  }

};

@Radium
export default class Feature extends React.Component {   

  constructor(props) {
    super(props);
  }

  render() {

    return (
    <div>
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <ToolbarTitle text="Status" />
          <ToolbarSeparator/>
          <ToolbarTitle text="In Progress" />
        </ToolbarGroup>
      </Toolbar>
    </div> 
    );
  }
};

// <Toolbar>
//   <ToolbarGroup key={0} float="left">
//     <DropDownMenu menuItems={filterOptions} />
//   </ToolbarGroup>
//   <ToolbarGroup key={1} float="right">
//     <ToolbarTitle text="Options" />
//     <FontIcon className="mui-icon-sort" />
//     <DropDownIcon iconClassName="icon-navigation-expand-more" menuItems={iconMenuItems} />
//     <ToolbarSeparator/>
//     <RaisedButton label="Create Broadcast" primary={true} />
//   </ToolbarGroup>
// </Toolbar>