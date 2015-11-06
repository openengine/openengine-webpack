import React from 'react';
import Radium from 'radium';
import { List } from 'material-ui/';
import Comment from './Comment';

@Radium
export default class CommentList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <List>
        <Comment />
      </List>
    );
  }
}
