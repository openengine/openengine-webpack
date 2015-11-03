import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import {Paper, IconMenu, MenuItem, IconButton, FontIcon, List, ListItem, ListDivider, Avatar} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors'
import Comment from "./Comment"

const styles = {

};

@Radium
export default class CommentList extends React.Component {   

constructor(props) {
    super(props);
  }

  render() {

    return (  
      <List>
        <Comment  />
      </List>
    );
  }
};