import React, { PropTypes } from 'react';
import Radium from 'radium';
import Relay from 'react-relay';
import Colors from 'material-ui/lib/styles/colors';
import {
  TextField,
  IconButton,
} from 'material-ui';
import NotesTab from './NotesTab';
import Note from './Note';
import FeatureText from './FeatureText';
import FeatureSelect from './FeatureSelect';
import FeatureAssign from './FeatureAssign';

// Inline JS Styles
const styles = {
  outerStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0, bottom: 0, left: 0, right: 0,
  },

  container: {
    fontFamily: 'Roboto, sans-serif',
    background: '#FFFFFF',
  },

  rowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '100%',
    minHeight: 550,
  },

  headerRowContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: '80%',
    position: 'fixed',
    marginTop: 4,
    boxShadow: '0px -5px 0px 0px ' + Colors.purple600,
    borderTop: 'solid 6px ' + Colors.greenA700,
    background: '#FFF',
    zIndex: 2,
  },

  headerTabContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'hidden',
    padding: 5,
    position: 'fixed',
    background: '#FFF',
    width: '80%',
    zIndex: 2,
  },

  notesContainer: {
    paddingBottom: 100,
  },

  featuresContainer: {
    position: 'fixed',
    marginTop: 4,
    boxShadow: '0px -5px 0px 0px ' + Colors.purple600 + ', 0 0px 2px rgba(0, 0, 0, 0.15)',
    borderTop: 'solid 6px ' + Colors.greenA700,
    backgroundColor: '#FDFDFE',
    height: 800,
    width: '20%',
    zIndex: 3,
  },

  columnContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch',
  },

  cardHeader: {
    flex: '1 0 auto',
    fontSize: '1.0rem',
    fontWeight: 100,
    color: '#9E9E9E',
  },

  search: {
    paddingTop: '10px',
  },

  searchTextBox: {
    maxWidth: 200,
  },

  cardName: {
    fontSize: '1.5rem',
    fontWeight: 100,
    color: '#9E9E9E',
    marginBottom: 40,
    marginRight: 20,
    display: 'inline-block',
  },

  cardId: {
    color: Colors.blueGrey100,
  },

  searchIcon: {
    position: 'relative',
    bottom: -5,
    fontSize: '1.0rem',
  },

  tab: {
    color: Colors.blueGrey200,
    fontWeight: 100,
    paddingLeft: 20,
    paddingRight: 20,
  },

  tabInkBar: {
    transition: 'left .4s',
    background: Colors.purple200,
  },
};


@Radium
class FullCard extends React.Component {
  static propTypes = {
    card: PropTypes.object,
    history: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = { tabOffset: 0 };
  }
  componentDidMount() {
      // Get the header heights so we can offset other components from fixed header components
    const titleHeight = this._headerTitle.offsetHeight;
    const tabHeight = this._headerTabs.offsetHeight;

    // Offset tabs from top fixed title
    this._headerTabs.style.paddingTop = '20px';
    this._headerTabs.style.marginTop = titleHeight + 'px';

    // Offset notes/comments from all header fixed components
    const headerHeight = titleHeight + tabHeight + 30;
    this._notesComments.style.marginTop = headerHeight + 'px';

    /* eslint react/no-did-mount-set-state: 0 */
    this.setState({tabOffset: headerHeight * -1});
  }
  render() {
    const {card, history} = this.props;
    const {tabOffset} = this.state;

    return (
      <div style={styles.outerStyle}>
        <div style={[styles.container]}>
          <div style={[styles.rowContainer]}>
            <div style={[styles.columnContainer, {width: '80%'}]} type="Content">
              <div ref={(ref) => this._headerTitle = ref} style={[styles.headerRowContainer]}>
                <IconButton onClick={()=> history.goBack()} style={{cursor: 'pointer'}} iconClassName="material-icons" iconStyle = {{color: Colors.blueGrey100}}>close</IconButton>
                <div style={[styles.cardHeader, {marginLeft: 20}]}>
                   <h2 style={[styles.cardName]}>{card.name}</h2> <small style={styles.cardId}>#184</small>
                </div>
                <div style={[styles.cardHeader, styles.search]}>
                  <TextField
                    style={styles.searchTextBox}
                    hintText={<span><i style={[styles.searchIcon]} className="material-icons">search</i>Search...</span>}
                    hintStyle={{paddingBottom: 5, fontSize: '0.9rem'}}
                    type="search" />
                </div>
              </div>
              <div ref={(ref) => this._headerTabs = ref} style={[styles.headerTabContainer]}>
                <NotesTab linkTo="product" headerOffset={tabOffset}>Product</NotesTab>
                <NotesTab linkTo="design" headerOffset={tabOffset}>Design</NotesTab>
                <NotesTab linkTo="engineering" headerOffset={tabOffset}>Engineering</NotesTab>
                <NotesTab linkTo="business" headerOffset={tabOffset}>Business</NotesTab>
                <NotesTab linkTo="qa" headerOffset={tabOffset}>Q/A</NotesTab>
              </div>
              <div ref={(ref) => this._notesComments = ref} style={[styles.columnContainer, styles.notesContainer]}>
                <Note name="product" />
                <Note name="design" />
                <Note name="engineering" />
                <Note name="business" />
                <Note name="qa" />
              </div>
            </div>
            <div style={[styles.columnContainer, styles.featuresContainer]} type="Features">
                <FeatureSelect feature={{name: 'status', options: [{text: 'To Do'}, {text: 'Doing'}, {text: 'Done'}]}} />
                <FeatureText feature={{name: 'completion', text: 'Not Complete'}} />
                <FeatureAssign feature={{name: 'assignee', options: [{user: 'Dave Bryand'}, {user: 'Luis Escobedo'}, {user: 'Scooby Doo'}]}} />
                <FeatureSelect feature={{name: 'impact', options: [{text: 'High'}, {text: 'Medium'}, {text: 'Low'}]}} />
                <FeatureSelect feature={{name: 'effort', options: [{text: 'High'}, {text: 'Medium'}, {text: 'Low'}]}} />
            </div>
          </div>
        </div>
       </div>
    );
  }
}

export default Relay.createContainer(FullCard, {
  prepareVariables({}) {
    return {
      limit: Number.MAX_SAFE_INTEGER || 9007199254740991,
    };
  },

  fragments: {
    card: () => Relay.QL`
      fragment on Card {
        name
      }
    `,
  },
});
