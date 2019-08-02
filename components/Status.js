import React, { useState, useEffect } from 'react';
import { View, Platform, StatusBar, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';

const statusHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : 0;

export default function Status() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // By moving this function inside the effect, we can clearly see the values it uses.
    async function fetchNetworkStatus() {
      NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
      });

      const isConnectedResult = await NetInfo.isConnected.fetch();

      setIsConnected(isConnectedResult);
    }

    fetchNetworkStatus();
  }, []);

  const backgroundColor = isConnected ? 'white' : 'red';
  const statusBar = (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={isConnected ? 'dark-content' : 'light-content'}
      animated={false}
    />
  );

  const messageContainer = (
    <View style={styles.messageContainer} pointerEvents="none">
      {statusBar}
      {!isConnected && (
        <View style={styles.bubble}>
          <Text style={styles.text}>No network connection</Text>
        </View>
      )}
    </View>
  );

  if (Platform.OS === 'ios') {
    return <View style={[styles.status, { backgroundColor }]}>{messageContainer}</View>;
  }
  return null;
}

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
  },
});
