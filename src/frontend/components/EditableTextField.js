import React, { PropTypes } from 'react';
import update from 'react-addons-update';
import Radium from 'radium';
import {
  TextField,
  RaisedButton,
} from 'material-ui';

const styles = {
  txtLbl: {
    visibility: 'hidden',
    top: 0,
    height: 0,
    zIndex: 0,
  },
  txt: (isFocus) => ({
    cursor: isFocus ? 'text' : 'url(/img/ic_edit_black_18px.svg), auto',
  }),
  editBtn: (isFocus) => ({
    opacity: isFocus ? 1 : 0,
    height: isFocus ? 'auto' : 0,
    position: isFocus ? 'relative' : 'absolute',
  }),
};

@Radium
export default class EditableTextField extends React.Component {
  static propTypes = {
    hintText: PropTypes.node,
    style: PropTypes.object,
    txtStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    value: PropTypes.string,
    text: PropTypes.string,
    saveText: PropTypes.string,
    editClick: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.txtChange = this.txtChange.bind(this);
    this.txtBlur = this.txtBlur.bind(this);
    this.txtFocus = this.txtFocus.bind(this);
    this.setValue = this.setValue.bind(this);
    this.state = {txtFocus: false};
  }
  setValue(value) {
    this._txt.setValue(value);
  }
  txtChange(event) {

  }
  txtFocus() {
    this.setState({txtFocus: true});
    this._txt.focus();
  }
  txtBlur() {
    this._txt.setValue(this.props.text);
    this.setState({txtFocus: false});
  }
  render() {
    const { text, saveText, style, editClick, value, txtStyle, underlineStyle } = this.props;
    const { txtFocus } = this.state;
    // Merge the passed in style with the focus style of the textField
    let fullTxtStyle = styles.txt(txtFocus);
    if (txtStyle) {
      fullTxtStyle = update(txtStyle, {$merge: styles.txt(txtFocus)});
    }
    return (
      <div style={style}>
        <div style={[txtStyle, styles.txtLbl]}>{text}</div>
        <TextField ref={(ref) => this._txt = ref} tabIndex={1} defaultValue={value} onFocus={this.txtFocus} onBlur={this.txtBlur} underlineStyle={underlineStyle} inputStyle={fullTxtStyle} fullWidth />
        <div style={styles.editBtn(txtFocus)}>
            <RaisedButton fullWidth={false} onTouchTap={editClick} labelStyle={{textTransform: 'none'}} label={saveText} secondary />
        </div>
      </div>
    );
  }
}
