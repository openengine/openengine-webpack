import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import Radium from 'radium';
import Relay from 'react-relay';
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'
import Colors from 'material-ui/lib/styles/colors'
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field'
import IconButton from 'material-ui/lib/icon-button';
import {Link, Element, Helpers} from 'react-scroll'
import NotesTab from "./NotesTab"

// Inline JS Styles
const styles = {
    outerStyle: {
        position: 'absolute',
        width:'100%',
        height:'100%',
        top:0, bottom:0, left:0, right:0
    },

    container: {
      fontFamily: 'Roboto, sans-serif',
      background: '#FFFFFF'
    },

    rowContainer: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'stretch',
      alignItems: 'stretch',
      overflow: 'hidden',
      width: '100%',
      minHeight: 550
    },

    headerRowContainer: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'stretch',
      overflow: 'hidden',
      width: '80%',
      position: 'fixed',
      marginTop:4,
      boxShadow: '0px -5px 0px 0px ' + Colors.purple600,
      borderTop: 'solid 6px ' + Colors.greenA700
    },

    headerTabContainer: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      overflow: 'hidden',
      padding: 3,
      position: 'fixed'
    },

    featuresContainer: {
      position:'fixed',
      marginTop:4,
      boxShadow: '0px -5px 0px 0px ' + Colors.purple600 + ', 0 0px 2px rgba(0, 0, 0, 0.15)',
      borderTop: 'solid 6px ' + Colors.greenA700,
      backgroundColor: '#FDFDFE',
      height: 800,
      width:'20%'
    },

    columnContainer: {
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'stretch',
      alignItems: 'stretch'
    },

    notesContainer: {

    },

    notesColumn: {
      marginLeft:'5%',
      flex: '1 0 80%',
      boxShadow: '0 0px 0px rgba(0, 0, 0, 0.15)'
    },

    commentsColumn: {
      flex: '1 0 20%',
      boxShadow: '0 0px 0px rgba(0, 0, 0, 0.15)'
    },

    cardHeader: {
      flex: '1 0 auto',
      fontSize:'1.0rem',
      fontWeight:100,
      color: '#9E9E9E'
    },

    search: {
      paddingTop: '10px'
    },

    searchTextBox: {
        maxWidth: 200 
    },

    cardTitle: {
      fontSize: '1.5rem',
      fontWeight:100,
      color: '#9E9E9E',
      marginBottom: 40,
      marginRight: 20,
      display: 'inline-block'
    },

    cardId: {
        color: Colors.blueGrey100
    },

    searchIcon: {
      position: 'relative',
      bottom: -5,
      fontSize: '1.0rem'
    },

    tab: {
      color: Colors.blueGrey200,
      fontWeight:100,
      paddingLeft:20,
      paddingRight:20
    },

    tabInkBar: {
      transition: 'left .4s',
      background: Colors.purple200
    }
};


@Radium
class FullCard extends React.Component {

  constructor(props) {
      super(props);

      this.state = {tabOffset:0};
     // this.tabLinkActivated = this.tabLinkActivated.bind(this);
     // this._handleTabActive = this._handleTabActive.bind(this);
   }

   componentDidMount() {

    // Get the header heights so we can offset other components from fixed header components
    const titleHeight = this._headerTitle.offsetHeight;
    const tabHeight = this._headerTabs.offsetHeight;

    // Offset tabs from top title
    this._headerTabs.style.marginTop = titleHeight + 20 + "px";

    // Offset notes and comments from all header fixed components
    const headerHeight =  titleHeight + tabHeight + 60; 
    this._notesComments.style.marginTop = headerHeight + "px";

     this.setState({tabOffset: headerHeight * -1});
  }

  render() {
    const {card} = this.props;
    const {activeTab, tabOffset} = this.state;

    return (
      <div style={styles.outerStyle}>
        <div style={[styles.container]}>
          <div style={[styles.rowContainer]}>
            <div style={[styles.columnContainer, {width:'80%'}]} type='Content'>
              <div ref={(ref) => this._headerTitle = ref} style={[styles.headerRowContainer]}>
                <IconButton onClick={()=> this.props.history.goBack()} style={{cursor:'pointer'}} iconClassName="material-icons" iconStyle = {{color: Colors.blueGrey100}}>close</IconButton>
                <div style={[styles.cardHeader, {marginLeft:20}]}>
                   <h2 style={[styles.cardTitle]}>{card.title}</h2> <small style={styles.cardId}>#184</small>
                </div>
                <div style={[styles.cardHeader, styles.search]}>
                  <TextField
                    style={styles.searchTextBox}
                    hintText={<span><i style={[styles.searchIcon]} className="material-icons">search</i>Search...</span>}
                    hintStyle={{paddingBottom: 5, fontSize:'0.9rem'}}
                    type="search" />
                </div>
              </div>
              <div ref={(ref) => this._headerTabs = ref} className="notes_tabs" style={[styles.headerTabContainer]}>
                    <NotesTab linkTo="product" headerOffset={tabOffset}>Product</NotesTab>
                    <NotesTab linkTo="design" headerOffset={tabOffset}>Design</NotesTab>
                    <NotesTab linkTo="engineering" headerOffset={tabOffset}>Engineering</NotesTab>
                    <NotesTab linkTo="business" headerOffset={tabOffset}>Business</NotesTab>
                    <NotesTab linkTo="qa" headerOffset={tabOffset}>Q/A</NotesTab>
              </div>
              <div ref={(ref) => this._notesComments = ref} style={[styles.columnContainer, styles.notesContainer]}>
                <div style={[styles.rowContainer]} type="Notes_Comments">
                   <div style={[styles.notesColumn]} type='Notes'> 
                      <Paper zDepth={0} rounded={false}>
                            <Element name="product" style={{height:800}}>
                              Product
                            </Element>
                            <Element name="design" style={{height:800}}>
                              Design
                            </Element>
                            <Element name="engineering" style={{height:800}}>
                              Engineering
                            </Element>
                            <Element name="business" style={{height:800}}>
                              Business
                            </Element>
                            <Element name="qa" style={{height:800}}>
                              QA
                            </Element>
                      </Paper>
                   </div>
                   <div style={[styles.columnContainer,styles.commentsColumn]} type='Comments'>
                      <Paper style={styles.flexComments} zDepth={0} rounded={false}>
                          COMMENTS
                      </Paper>
                   </div>
                </div>
              </div>
            </div>
            <div style={[styles.columnContainer, styles.featuresContainer]} type='Features'>
              
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

