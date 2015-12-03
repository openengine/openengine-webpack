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
    btnText: PropTypes.string,
    btnClick: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.txtBlur = this.txtBlur.bind(this);
    this.txtFocus = this.txtFocus.bind(this);
    this.innerBtnClick = this.innerBtnClick.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
    this.setValue = this.setValue.bind(this);
    this.getValue = this.getValue.bind(this);
    this.state = {txtFocus: false, enterKeyPressed: false};
  }
  setValue(value) {
    this._txt.setValue(value);
  }
  getValue() {
    return this._txt.getValue();
  }
  txtFocus() {
    this.setState({txtFocus: true, enterKeyPressed: false});
    this._txt.focus();
  }
  innerBtnClick() {
    if (this.props.btnClick) {
      this.props.btnClick.call();
    }
    this.setState({txtFocus: false});
  }
  enterPressed() {
    this.innerBtnClick();
    // Call blur() in the callback so that we can tell that the enter key has been pressed...
    this.setState({enterKeyPressed: true}, ()=>{ this._txt.blur(); });
  }
  txtBlur(event) {
    // We need to reset the textBox only when we are actually "bluring" off the textBox i.e. not when we press Enter or hit the primary Button..
    const reset = (!this.state.enterKeyPressed && (!event.relatedTarget || !event.relatedTarget.id.startsWith('editableTxtBtn')));
    if (reset) {
      this._txt.setValue(this.props.text);
      this.setState({txtFocus: false});
    }
  }
  render() {
    const { text, btnText, style, value, txtStyle, underlineStyle } = this.props;
    const { txtFocus } = this.state;
    // Merge the passed in style with the focus style of the textField
    let fullTxtStyle = styles.txt(txtFocus);
    if (txtStyle) {
      fullTxtStyle = update(txtStyle, {$merge: styles.txt(txtFocus)});
    }
    return (
      <div style={style}>
        <div style={[txtStyle, styles.txtLbl]}>{text}</div>
        <TextField onEnterKeyDown={this.enterPressed.bind(this)} ref={(ref) => this._txt = ref} tabIndex={1} defaultValue={value} onFocus={this.txtFocus} onBlur={this.txtBlur} underlineStyle={underlineStyle} inputStyle={fullTxtStyle} fullWidth />
        <div style={styles.editBtn(txtFocus)}>
            <RaisedButton id="editableTxtBtn" fullWidth={false} onClick={this.innerBtnClick} labelStyle={{textTransform: 'none'}} label={btnText} secondary />
        </div>
      </div>
    );
  }
}
