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
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import {Link, Element, Helpers} from 'react-scroll'

// Inline JS Styles
const styles = {
    outerStyle: {
        position: 'absolute',
        width:'100%',
        height:'100%',
        top:0, bottom:0, left:0, right:0
    },

    flexContainer: {
      fontFamily: 'Roboto, sans-serif',
      background: '#FFFFFF'
    },

    flexRowContainer: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'stretch',
      alignItems: 'stretch',
      overflow: 'hidden',
      width: '100%',
      minHeight: 550
    },

    flexHeaderRowContainer: {
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

    flexHeaderTabContainer: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'stretch',
      alignItems: 'stretch',
      overflow: 'hidden',
      padding: 3,
      position: 'fixed'
    },

    flexFeaturesContainer: {
      position:'fixed',
      marginTop:4,
      boxShadow: '0px -5px 0px 0px ' + Colors.purple600 + ', 0 0px 2px rgba(0, 0, 0, 0.15)',
      borderTop: 'solid 6px ' + Colors.greenA700,
      backgroundColor: '#FDFDFE',
      height: 800,
      width:'20%'
    },

    flexColumnContainer: {
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'stretch',
      alignItems: 'stretch'
    },

    flexNotesContainer: {

    },

    flexBoardColumn: {
      width:'33%',
      flex: '1 0 auto',
      boxShadow: '0 0px 2px rgba(0, 0, 0, 0.15)'
    },

    flexNotesColumn: {
      marginLeft:'5%',
      flex: '1 0 80%',
      boxShadow: '0 0px 0px rgba(0, 0, 0, 0.15)'
    },

    flexCommentsColumn: {
      flex: '1 0 20%',
      boxShadow: '0 0px 0px rgba(0, 0, 0, 0.15)'
    },

    flexBoardHeader: {
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
      this.state = {
         activeTab: 'product'
      };
   };

   componentDidMount() {

    // Get the header heights so we can offset other components from fixed header components
    const titleHeight = this._headerTitle.offsetHeight;
    const tabHeight = this._headerTabs.offsetHeight;

    // Offset tabs from top title
    this._headerTabs.style.marginTop = titleHeight + "px";

    // Offset notes and comments from all header fixed components
    const headerHeight =  titleHeight + tabHeight + 20; 
    this._notesComments.style.marginTop = headerHeight + "px";

  };

    _handleTabActive(tab){
    
     //  Helpers.Scroll.scrollTo('notes_business');

  };

  tabLinkActivated(to){
    this.setState(update(this.state, {
      activeTab: to}));
  };

  getActiveTab (){
    return activeTab;
  }

  render() {
    const {card} = this.props;

    return (
      <div style={styles.outerStyle}>
        <div style={[styles.flexContainer]}>
          <div style={[styles.flexRowContainer]}>
            <div style={[styles.flexColumnContainer, {width:'80%'}]} type='Content'>
              <div ref={(ref) => this._headerTitle = ref} style={[styles.flexHeaderRowContainer]}>
                <IconButton onClick={()=> this.props.history.goBack()} style={{cursor:'pointer'}} iconClassName="material-icons" iconStyle = {{color: Colors.blueGrey100}}>close</IconButton>
                <div style={[styles.flexBoardHeader, {marginLeft:20}]}>
                   <h2 style={[styles.cardTitle]}>{card.title}</h2> <small style={styles.cardId}>#184</small>
                </div>
                  <div style={[styles.flexBoardHeader, styles.search]}>
                      <TextField
                        style={styles.searchTextBox}
                        hintText={<span><i style={[styles.searchIcon]} className="material-icons">search</i>Search...</span>}
                        hintStyle={{paddingBottom: 5, fontSize:'0.9rem'}}
                        type="search" />
                  </div>
              </div>
              <div ref={(ref) => this._headerTabs = ref} style={[styles.flexHeaderTabContainer]}>
               <Tabs value={this.state.activeTab} inkBarStyle={styles.tabInkBar} tabItemContainerStyle ={{background: '#FFFFFF'}}>
                    <Tab style={styles.tab} value="product" label={<Link tab='product' to="product" onSetActive={this.tabLinkActivated} spy={true} smooth={true} offset={-150} duration={400} >Product</Link>} />
                    <Tab style={styles.tab} value="design" label={<Link tab='design' to="design" onSetActive={this.tabLinkActivated}  spy={true} smooth={true} offset={-150} duration={400} >Design</Link>} />
                    <Tab style={styles.tab} value="engineering" label={<Link to="engineering" onSetActive={this.tabLinkActivated}  spy={true} smooth={true} offset={-150} duration={400} >Engineering</Link>} />
                    <Tab style={styles.tab} onActive={this._handleTabActive} value="business" label={<Link to="business" onSetActive={this.tabLinkActivated} spy={true} smooth={true} offset={-150} duration={400} >Business</Link>} />
                    <Tab style={styles.tab} value="qa" label={<Link to="qa" onSetActive={this.tabLinkActivated}  spy={true} smooth={true} offset={-150} duration={400} >Q/A</Link>} />
                </Tabs>
              </div>
              <div ref={(ref) => this._notesComments = ref} style={[styles.flexColumnContainer, styles.flexNotesContainer]}>
                <div style={[styles.flexRowContainer]} type="Notes_Comments">
                   <div style={[styles.flexNotesColumn]} type='Notes'> 
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
                   <div style={[styles.flexColumnContainer,styles.flexCommentsColumn]} type='Comments'>
                      <Paper style={styles.flexComments} zDepth={0} rounded={false}>
                          COMMENTS
                      </Paper>
                   </div>
                </div>
              </div>
            </div>
            <div style={[styles.flexColumnContainer, styles.flexFeaturesContainer]} type='Features'>
              
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




// import React from 'react';
// import Radium from 'radium';
// import Relay from 'react-relay';
// import Avatar from 'material-ui/lib/avatar'
// import FlatButton from 'material-ui/lib/flat-button'
// import Colors from 'material-ui/lib/styles/colors'
// import Paper from 'material-ui/lib/paper';
// import TextField from 'material-ui/lib/text-field'
// import IconButton from 'material-ui/lib/icon-button';
// import Tabs from 'material-ui/lib/tabs/tabs'
// import Tab from 'material-ui/lib/tabs/tab'
// import {Link, Element} from 'react-scroll'

// // Inline JS Styles
// const styles = {
//     flexContainer: {
//       fontFamily: 'Roboto, sans-serif',
//       background: '#FFFFFF'
//     },

//     flexRowContainer: {
//       display: 'flex',
//       flexFlow: 'row nowrap',
//       justifyContent: 'center',
//       alignItems: 'stretch',
//       overflow: 'hidden',
//       width: '100%',
//       padding: 3,
//       minHeight: 550
//     },

//     flexHeaderRowContainer: {
//       display: 'flex',
//       flexFlow: 'row nowrap',
//       justifyContent: 'center',
//       alignItems: 'stretch',
//       overflow: 'hidden',
//       width: '100%',
//       padding: 3
//     },

//     flexHeaderTabContainer: {
//       display: 'flex',
//       flexFlow: 'row nowrap',
//       justifyContent: 'stretch',
//       alignItems: 'stretch',
//       overflow: 'hidden',
//       width: '100%',
//       padding: 3
//     },

//     flexColumnContainer: {
//       display: 'flex',
//       flexFlow: 'column nowrap',
//       justifyContent: 'stretch',
//       alignItems: 'stretch'
//     },

//     flexNotesContainer: {
//       overflowY: 'scroll',
//       position: "relative", 
//       border:'solid 1px red',
//       height: 100
//     },

//     flexBoardColumn: {
//       width:'33%',
//       flex: '1 0 auto',
//       boxShadow: '0 0px 2px rgba(0, 0, 0, 0.15)'
//     },

//     flexNotesColumn: {
//       marginLeft:'5%',
//       flex: '1 0 80%',
//       boxShadow: '0 0px 0px rgba(0, 0, 0, 0.15)'
//     },

//     flexCommentsColumn: {
//       flex: '1 0 20%',
//       boxShadow: '0 0px 0px rgba(0, 0, 0, 0.15)'
//     },

//     flexBoardHeader: {
//       flex: '1 0 auto',
//       fontSize:'1.0rem',
//       fontWeight:100,
//       color: '#9E9E9E'
//     },

//     search: {
//       paddingTop: '10px'
//     },

//     searchTextBox: {
//         maxWidth: 200 
//     },

//     cardTitle: {
//       fontSize: '1.5rem',
//       fontWeight:100,
//       color: '#9E9E9E',
//       marginBottom: 40,
//       marginRight: 20,
//       display: 'inline-block'
//     },

//     cardId: {
//         color: Colors.blueGrey100
//     },

//     searchIcon: {
//       position: 'relative',
//       bottom: -5,
//       fontSize: '1.0rem'
//     },

//     tab: {
//       color: Colors.blueGrey200,
//       fontWeight:100,
//       paddingLeft:20,
//       paddingRight:20
//     },

//     tabInkBar: {
//       transition: 'left .4s',
//       background: Colors.purple200
//     }
// };

// //let ScrollLink = Scroll.Link;


// @Radium
// class FullCard extends React.Component {
//   render() {
//     const {card} = this.props;
    
//     const outerStyle = {
//         position: 'absolute',
//         width:'100%',
//         height:'100%',
//         top:0, bottom:0, left:0, right:0,
//         marginTop:4,
//         boxShadow: '0px 0px 0px 4px ' + Colors.purple600,
//         borderTop: 'solid 6px ' + Colors.greenA700
//     };

//     const featuresStyle = {
//         backgroundColor: '#FDFDFE',
//         height: 800,
//         boxShadow: '0 0px 2px rgba(0, 0, 0, 0.15)'
//      };

//     return (
//       <div style={outerStyle}>
//         <div style={[styles.flexContainer]}>
//           <div style={[styles.flexRowContainer]}>
//             <div style={[styles.flexColumnContainer, {width:'80%'}]} type='Content'>
//               <div style={[styles.flexHeaderRowContainer]}>
//                   <IconButton onClick={()=> this.props.history.goBack()} style={{cursor:'pointer'}} iconClassName="material-icons" iconStyle = {{color: Colors.blueGrey100}}>close</IconButton>
//                   <div style={[styles.flexBoardHeader, {marginLeft:20}]}>
//                      <h2 style={[styles.cardTitle]}>{card.title}</h2> <small style={styles.cardId}>#184</small>
//                   </div>
//                   <div style={[styles.flexBoardHeader, styles.search]}>
//                       <TextField
//                         style={styles.searchTextBox}
//                         hintText={<span><i style={[styles.searchIcon]} className="material-icons">search</i>Search...</span>}
//                         hintStyle={{paddingBottom: 5, fontSize:'0.9rem'}}
//                         type="search" />
//                   </div>
//               </div>
//               <div style={[styles.flexHeaderTabContainer]}>
//                <Tabs inkBarStyle={styles.tabInkBar} tabItemContainerStyle ={{background: '#FFFFFF'}}>
//                     <Tab style={styles.tab} label="Product" />
//                     <Tab style={styles.tab} label={<Link to="test1" spy={true} smooth={true} offset={20} containerId="notes_comments" duration={400} >Test 1</Link>} />
//                     <Tab style={styles.tab} label="Engineering" />
//                     <Tab style={styles.tab} label="Business" />
//                     <Tab style={styles.tab} label="Q/A" />
//                 </Tabs>
//               </div>
//               <div id="notes_comments" style={[styles.flexColumnContainer, styles.flexNotesContainer]}>
//                 <div style={[styles.flexRowContainer]} type="Notes_Comments">
//                    <div style={[styles.flexNotesColumn]} type='Notes'> 
//                       <Paper zDepth={0} rounded={false}>
//                              <div style={{height:400}}>
//                                 &nbsp;
//                              </div> 
//                             <Element name="test1" className="element">
//                               test 1
//                             </Element>
//                       </Paper>
//                    </div>
//                    <div style={[styles.flexColumnContainer,styles.flexCommentsColumn]} type='Comments'>
//                       <Paper style={styles.flexComments} zDepth={0} rounded={false}>
//                           COMMENTS
//                       </Paper>
//                    </div>
//                 </div>
//               </div>
//             </div>
//             <div style={[styles.flexColumnContainer, featuresStyle, {width:'20%'}]} type='Features'>
              
//             </div>
//           </div>
//         </div>
//        </div>

//     );
//   }
// };

// export default Relay.createContainer(FullCard, {
//   prepareVariables({status}) {
//     return {
//       limit: Number.MAX_SAFE_INTEGER || 9007199254740991
//     };
//   },

//   fragments: {
//     card: () => Relay.QL`
//       fragment on Card {
//         title
//       }
//     `,
//   },
// });

