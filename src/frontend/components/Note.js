import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Paper from 'material-ui/lib/paper';
import Colors from 'material-ui/lib/styles/colors';
import {Element} from 'react-scroll'
import CommentList from "./CommentList"

const styles = {
  rowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%'
  },

  columnContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch'
  },

  notesColumn: {
    flex: '0 1 60%',
    boxShadow: '0 0px 0px rgba(0, 0, 0, 0.15)',
  },

  commentsColumn: {
    flex: '0 1 35%',
    boxShadow: '0 0px 0px rgba(0, 0, 0, 0.15)'
  },

  title: {
    fontWeight: 100,
    color: Colors.blueGrey400
  },

  note: {
    fontWeight: 300,
    fontSize:'0.9rem',
    color: Colors.grey600,
    lineHeight:'1.5rem'
  },

  list: {
    listStyle: 'circle outside'
  }
};

@Radium
export default class Note extends React.Component {  

  static propTypes = {
    name: PropTypes.string.isRequired
  };
  render() {
    const {name } = this.props;
    return (
      <Element name={name}>
        <div style={[styles.rowContainer]}>
          <div style={[styles.notesColumn]}> 
            <Paper style={styles.note} zDepth={0} rounded={false}>
              <h1 style={styles.title}>{name}</h1>
              <p > Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla eget justo a aliquam. Aliquam tincidunt diam vitae interdum sollicitudin. Quisque vitae lacinia sem, vehicula faucibus nunc. Morbi at mollis tellus. Sed eu tellus sed magna dictum posuere. Morbi at purus ligula. Nam nec imperdiet ex. Phasellus hendrerit vestibulum arcu, sit amet consequat diam consequat sed. Integer lobortis risus quis luctus auctor. Phasellus felis felis, finibus vel faucibus sed, lacinia eu dolor.
              </p>
              <ul style={styles.list}>
                <li>
                    Aenean placerat commodo fermentum. Vivamus porta libero elit, ac imperdiet tortor posuere vita
                </li>
                <li>
                    Curabitur quis cursus purus. Curabitur vel sodales urna, ut tempus neque.
                </li>
                <li>
                    Suspendisse facilisis urna ut fringilla condimentum. Aenean hendrerit turpis eget eros efficitur
                </li>
              </ul>      
            </Paper>
          </div>           
          <div style={[styles.commentsColumn]}>
                <CommentList />
          </div>
        </div> 
      </Element>
    );
  }
};