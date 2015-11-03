import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import {DropDownMenu} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors'

const styles = {

  rowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    overflow: 'visible',
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
    fontSize:'0.7rem',
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

  featureAction:{
    fontWeight: 400,
    fontSize:'0.7rem',
    color: Colors.grey600
  }

};

@Radium
export default class FeatureSelect extends React.Component {   

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
          <DropDownMenu labelStyle={styles.dropdown} menuItemStyle={styles.dropdown} menuItems={feature.options} />
      </div>
    </div> 
    );
  }
};