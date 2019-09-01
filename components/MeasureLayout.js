import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';

export default function MeasureLayout({ children }) {
  const [receivedLayout, setReceivedLayout] = useState(null);

  const handleLayout = event => {
    const {
      nativeEvent: { layout },
    } = event;
    setReceivedLayout({
      ...layout,
      y: layout.y + (Platform.OS === 'android' ? Constants.statusBarHeight : 0),
    });
  };
  // Measure the available space with a placeholder view set to flex 1
  if (!receivedLayout) {
    return <View onLayout={handleLayout} style={styles.container} />;
  }

  return children(receivedLayout);
}

MeasureLayout.propTypes = {
  children: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
