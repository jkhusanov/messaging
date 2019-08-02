import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Status from './components/Status';
import MessageList from './components/MessageList';
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';

export default function App() {
  const [messages, setMessages] = useState([
    createImageMessage('https://picsum.photos/200'),
    createTextMessage('World'),
    createTextMessage('Hello'),
    createLocationMessage({ latitude: 37.78825, longitude: -122.4324 }),
  ]);

  const renderMessageList = () => (
    <View style={styles.content}>
      <MessageList messages={messages} onPressMessage={handlePressMessage} />
    </View>
  );
  const renderInputMethodEditor = () => <View style={styles.inputMethodEditor}></View>;
  const renderToolbar = () => <View style={styles.toolbar}></View>;
  const handlePressMessage = () => {};

  return (
    <View style={styles.container}>
      <Status />
      {renderMessageList()}
      {renderToolbar()}
      {renderInputMethodEditor()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
});
