import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import {Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, IconButton, FontIcon, Avatar} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors'

const styles = {

  rowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%'
  },

  nameColumn: {
    flex: '0 1 30%',
    fontWeight: 300,
    fontSize:'0.7rem',
    color: Colors.grey500
  },

  actionColumn: {
    flex: '0 1 70%',
    textAlign:'left'
  },

  dropdown: {
    fontWeight: 400,
    fontSize:'0.8rem',
    color: Colors.grey600
  },

  featureName:{
    fontWeight: 300,
    fontSize:'0.7rem',
    color: Colors.grey500,
    marginLeft:'1rem',
    marginTop:'1rem',
    textAlign:'right'
  },

  featureText:{
    fontWeight: 400,
    fontSize:'0.7rem',
    color: Colors.grey600,
    marginTop:'1rem',
    textAlign:'left',
    paddingLeft:24
  }

};

@Radium
export default class FeatureText extends React.Component {   

  constructor(props) {
    super(props);
  }

  render() {
    const { feature } = this.props;

    return (
      <div style={styles.rowContainer}>
        <div style={styles.nameColumn}>
            <h2 style={styles.featureName}>{feature.name} </h2>
        </div>
        <div style={styles.actionColumn}>
            <div style={styles.featureText}>{feature.text}</div>
        </div>
      </div> 
    );
  }
};