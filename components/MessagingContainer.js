import React, { useEffect } from 'react';
import { BackHandler, LayoutAnimation, Platform, UIManager, View } from 'react-native';
import PropTypes from 'prop-types';
import { isIphoneX } from 'react-native-iphone-x-helper';

export const INPUT_METHOD = { NONE: 'NONE', KEYBOARD: 'KEYBOARD', CUSTOM: 'CUSTOM' };

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MessagingContainer(props) {
  const { onChangeInputMethod } = props;

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { inputMethod } = props;

      if (inputMethod === INPUT_METHOD.CUSTOM) {
        onChangeInputMethod(INPUT_METHOD.NONE);
        return true;
      }

      return false;
    });

    return () => {
      subscription.remove();
    };
  });

  useEffect(() => {
    if (props.keyboardVisible) {
      // Keyboard shown
      onChangeInputMethod(INPUT_METHOD.KEYBOARD);
    } else if (
      // Keyboard hidden
      props.keyboardVisible &&
      props.inputMethod !== INPUT_METHOD.CUSTOM
    ) {
      onChangeInputMethod(INPUT_METHOD.NONE);
    }

    // Animate between states
    const animation = LayoutAnimation.create(
      props.keyboardAnimationDuration,
      Platform.OS === 'android'
        ? LayoutAnimation.Types.easeInEaseOut
        : LayoutAnimation.Types.keyboard,
      LayoutAnimation.Properties.opacity
    );
    LayoutAnimation.configureNext(animation);
  }, [props.keyboardVisible]);

  const {
    children,
    renderInputMethodEditor,
    inputMethod,
    containerHeight,
    contentHeight,
    keyboardHeight,
    keyboardWillShow,
    keyboardWillHide,
  } = props;

  const useContentHeight = keyboardWillShow || inputMethod === INPUT_METHOD.KEYBOARD;

  const containerStyle = {
    height: useContentHeight ? contentHeight : containerHeight,
  };

  const showCustomInput = inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow;

  const keyboardIsHidden = inputMethod === INPUT_METHOD.NONE && !keyboardWillShow;

  const keyboardIsHiding = inputMethod === INPUT_METHOD.KEYBOARD && keyboardWillHide;

  const inputStyle = {
    height: showCustomInput ? keyboardHeight || 250 : 0,
    marginTop: isIphoneX() && (keyboardIsHidden || keyboardIsHiding) ? 24 : 0,
  };
  return (
    <View style={containerStyle}>
      {children}
      <View style={inputStyle}>{renderInputMethodEditor()}</View>
    </View>
  );
}

MessagingContainer.propTypes = {
  // From `KeyboardState`
  containerHeight: PropTypes.number.isRequired,
  contentHeight: PropTypes.number.isRequired,
  keyboardHeight: PropTypes.number.isRequired,
  keyboardVisible: PropTypes.bool.isRequired,
  keyboardWillShow: PropTypes.bool.isRequired,
  keyboardWillHide: PropTypes.bool.isRequired,
  keyboardAnimationDuration: PropTypes.number.isRequired,

  // Managing the IME type
  inputMethod: PropTypes.oneOf(Object.values(INPUT_METHOD)).isRequired,
  onChangeInputMethod: PropTypes.func,

  // Rendering content
  children: PropTypes.node,
  renderInputMethodEditor: PropTypes.func.isRequired,
};

MessagingContainer.defaultProps = {
  children: null,
  onChangeInputMethod: () => {},
};
