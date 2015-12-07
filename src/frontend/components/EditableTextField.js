import React, { PropTypes } from 'react';
import update from 'react-addons-update';
import Radium, { Style }from 'radium';
import debounce from 'debounce';
import {
  TextField,
} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
const styles = {
  txtLbl: {
    visibility: 'hidden',
    top: 0,
    height: 0,
    zIndex: 0,
    lineHeight: '150%',
  },
  txt: (isFocus) => ({
    lineHeight: '150%',
    cursor: isFocus ? 'text' : 'url(/img/ic_edit_black_18px.svg), auto',
    zIndex: 1,
  }),
  multiTxt: {
    lineHeight: '150%',
    zIndex: 1,
  },
  txtContainer: {
    ':hover': { // We need a :hover property so that we can get the ":hover" state from Radium in the class below
      zIndex: 1,
    },
  },
  underlineFocus: (isEditing, isSaved) => ({
    borderColor: isEditing ? Colors.amber200 : isSaved ? Colors.green200 : Colors.blueGrey300,
  }),
  underline: {
    borderColor: Colors.blueGrey100,
  },
};

@Radium
export default class EditableTextField extends React.Component {
  static propTypes = {
    hintText: PropTypes.node,
    style: PropTypes.object,
    txtStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    txtContainerStyle: PropTypes.object,
    hintStyle: PropTypes.object,
    value: PropTypes.string,
    text: PropTypes.string,
    saveText: PropTypes.string,
    onSave: PropTypes.func,
    multiLine: PropTypes.bool,
    rows: PropTypes.number,
    tabIndex: PropTypes.number,
    uniqueKey: PropTypes.string,
  };
  static defaultProps = {
    multilLine: false,
    tabIndex: 0,
    rows: 1,
  }
  constructor(props) {
    super(props);
    this.txtBlur = this.txtBlur.bind(this);
    this.txtFocus = this.txtFocus.bind(this);
    // The save method is 'debounced' to allow for a delay in the saving of the textBox's value for a specified amount of ms while
    // the user is typing...
    this.innerOnSave = debounce(this.innerOnSave.bind(this), 1000).bind(this);
    this.setValue = this.setValue.bind(this);
    this.getValue = this.getValue.bind(this);
    this.txtChange = this.txtChange.bind(this);
    this.state = {txtFocus: false, isEditing: false, isSaved: false};
  }
  setValue(value) {
    this._txt.setValue(value);
  }
  getValue() {
    return this._txt.getValue();
  }
  txtFocus() {
    this.setState({txtFocus: true, isSaved: false});
    this._txt.focus();
  }
  innerOnSave() {
    if (this.props.onSave) {
      this.props.onSave.call();
    }
    this.setState({isEditing: false, isSaved: true});
  }
  txtChange() {
    this.setState({isEditing: true});
    this.innerOnSave();
  }
  txtBlur() {
    // We also save when the control loses focus...
    this.innerOnSave();
    this.setState({txtFocus: false, isSaved: false});
  }
  render() {
    const { text, style, value, txtStyle, txtContainerStyle, underlineFocusStyle, underlineStyle, hintStyle,
      hintText, multiLine, tabIndex, rows, uniqueKey } = this.props;
    const { txtFocus, isEditing, isSaved } = this.state;
    const isTxtHover = Radium.getState(this.state, uniqueKey, ':hover');

    // Merge the passed in style with the focus style of the textField
    let combinedTxtStyle = multiLine ? styles.multiTxt : styles.txt(txtFocus);
    if (txtStyle) {
      combinedTxtStyle = update(txtStyle, {$merge: multiLine ? styles.multiTxt : styles.txt(txtFocus)});
    }
    let combinedUnderlineStyle = styles.underline;
    if (underlineStyle) {
      combinedUnderlineStyle = update(underlineStyle, {$merge: styles.underline});
    }
    let combinedUnderlineFocusStyle = styles.underlineFocus(isEditing, isSaved);
    if (underlineFocusStyle) {
      combinedUnderlineFocusStyle = update(underlineFocusStyle, {$merge: styles.underlineFocus(isEditing, isSaved)});
    }

    // We need to override some Material-Ui internal styles using Radium's tyle scope selector if the textbox is Multiline aka textarea
    let multiLineStyle = '';
    if (multiLine) {
      multiLineStyle = (
        <Style scopeSelector=".editableMultiLine"
          rules={{
            textarea: {
              lineHeight: '150% !important',
              cursor: 'url(/img/ic_edit_black_18px.svg), auto',
              zIndex: 1,
            },
          }}
        />);
    }
    return (
      <div key={uniqueKey} className={multiLine ? 'editableMultiLine' : ''} style={[style, styles.txtContainer]}>
        {multiLineStyle}
        <div onClick={this.txtFocus} style={[txtStyle, styles.txtLbl]}>{text}</div>
        <TextField style={txtContainerStyle} multiLine={multiLine}
          ref={(ref) => this._txt = ref} tabIndex={tabIndex} rows={rows} defaultValue={value} onFocus={this.txtFocus} onBlur={this.txtBlur}
          underlineStyle={isTxtHover ? combinedUnderlineStyle : underlineStyle} underlineFocusStyle={combinedUnderlineFocusStyle}
          inputStyle={combinedTxtStyle} hintStyle={hintStyle} onChange={this.txtChange} hintText={hintText} fullWidth />
      </div>
    );
  }
}
