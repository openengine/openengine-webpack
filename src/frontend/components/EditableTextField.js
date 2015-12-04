import React, { PropTypes } from 'react';
import update from 'react-addons-update';
import Radium, { Style }from 'radium';
import {
  TextField,
  RaisedButton,
} from 'material-ui';

const styles = {
  txtLbl: (isFocus) => ({
    top: 0,
    opacity: isFocus ? 1 : 0,
    height: isFocus ? 'auto' : 0,
    cursor: isFocus ? 'url(/img/ic_edit_black_18px.svg), auto' : 'text',
    lineHeight: '150%',
  }),
  txt: (isFocus) => ({
    lineHeight: '150%',
    top: 0,
    verticalAlign: 'top',
    borderStyle: 'none',
    height: isFocus ? 'auto' : 0,
    opacity: isFocus ? 1 : 0,
    position: isFocus ? 'relative' : 'absolute',
    zIndex: 1,
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
    multiLine: PropTypes.bool,
  };
  static defaultProps = {
    multilLine: false,
  }
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
    if (!this.props.multiLine) {
      this.innerBtnClick();
      // Call blur() in the callback so that we can tell that the enter key has been pressed...
      this.setState({enterKeyPressed: true}, ()=>{ this._txt.blur(); });
    }
  }
  txtBlur(event) {
    // We need to reset the textBox only when we are actually "bluring" off the textBox i.e. not when we press Enter or hit the primary Button..
    const reset = (!this.state.enterKeyPressed && (!event.relatedTarget || !event.relatedTarget.id.startsWith('editableTxtBtn')));
    if (reset) {
      // this._txt.setValue(this.props.text);
      this.setState({txtFocus: false});
    }
  }
  render() {
    const { text, btnText, style, value, txtStyle, underlineStyle, multiLine } = this.props;
    const { txtFocus } = this.state;
    // Merge the passed in style with the focus style of the textField
    let fullTxtStyle = styles.txt(txtFocus);
    if (txtStyle) {
      fullTxtStyle = update(txtStyle, {$merge: styles.txt(txtFocus)});
    }
    // We need to override some Material-Ui internal styles using Radium's tyle scope selector if the textbox is Multiline aka textarea
    let multiLineStyle = '';
    if (multiLine) {
      multiLineStyle = (
        <Style scopeSelector=".editableMultiLine"
          rules={{
            textarea: {
              marginTop: '0px !important',
              marginBottom: '0px !important',
            },
          }}
        />);
    }
    return (
      <div className={multiLine ? 'editableMultiLine' : ''} style={style}>
        {multiLineStyle}
        <div onClick={this.txtFocus} style={[txtStyle, styles.txtLbl(!txtFocus)]}>{text}</div>
        <TextField style={{height: 'auto'}} multiLine={multiLine} onEnterKeyDown={this.enterPressed.bind(this)}
          ref={(ref) => this._txt = ref} tabIndex={1} defaultValue={value} onFocus={this.txtFocus} onBlur={this.txtBlur}
          underlineFocusStyle={{bottom: 3}} underlineStyle={underlineStyle} inputStyle={fullTxtStyle} fullWidth />
        <div style={styles.editBtn(txtFocus)}>
            <RaisedButton id="editableTxtBtn" fullWidth={false} onClick={this.innerBtnClick} labelStyle={{textTransform: 'none'}} label={btnText} secondary />
        </div>
      </div>
    );
  }
}
