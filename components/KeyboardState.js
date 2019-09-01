import React, { useState, useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import PropTypes from 'prop-types';

const INITIAL_ANIMATION_DURATION = 250;

export default function KeyboardState(props) {
  const [contentHeight, setContentHeight] = useState(props.layout.height);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardWillShow, setKeyboardWillShow] = useState(false);
  const [keyboardWillHide, setKeyboardWillHide] = useState(false);
  const [keyboardAnimationDuration, setKeyboardAnimationDuration] = useState(
    INITIAL_ANIMATION_DURATION
  );
  useEffect(() => {
    let subscriptions;
    if (Platform.OS === 'ios') {
      subscriptions = [
        Keyboard.addListener('keyboardWillShow', keyboardWillShowFunction),
        Keyboard.addListener('keyboardWillHide', keyboardWillHideFunction),
        Keyboard.addListener('keyboardDidShow', keyboardDidShowFunction),
        Keyboard.addListener('keyboardDidHide', keyboardDidHideFunction),
      ];
    } else {
      subscriptions = [
        Keyboard.addListener('keyboardDidHide', keyboardDidHideFunction),
        Keyboard.addListener('keyboardDidShow', keyboardDidShowFunction),
      ];
    }
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  });

  const keyboardWillShowFunction = event => {
    setKeyboardWillShow(true);
    measure(event);
  };

  const keyboardDidShowFunction = event => {
    setKeyboardWillShow(false);
    setKeyboardVisible(true);
    measure(event);
  };

  const keyboardWillHideFunction = event => {
    setKeyboardWillHide(true);
    measure(event);
  };

  const keyboardDidHideFunction = () => {
    setKeyboardWillHide(false);
    setKeyboardVisible(false);
  };
  const measure = event => {
    const { layout } = props;

    const {
      endCoordinates: { height, screenY },
      duration = INITIAL_ANIMATION_DURATION,
    } = event;

    setContentHeight(screenY - layout.y);
    setKeyboardHeight(height);
    setKeyboardAnimationDuration(duration);
  };

  const { children, layout } = props;

  return children({
    containerHeight: layout.height,
    contentHeight,
    keyboardHeight,
    keyboardVisible,
    keyboardWillShow,
    keyboardWillHide,
    keyboardAnimationDuration,
  });
}

KeyboardState.propTypes = {
  layout: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  children: PropTypes.func.isRequired,
};
