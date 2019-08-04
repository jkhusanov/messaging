import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, Image, TouchableHighlight } from 'react-native';
import Status from './components/Status';
import MessageList from './components/MessageList';
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';

export default function App() {
  const [messages, setMessages] = useState([
    createImageMessage('https://picsum.photos/id/1043/500/500'),
    createTextMessage('World'),
    createTextMessage('Hello'),
    createLocationMessage({ latitude: 37.78825, longitude: -122.4324 }),
  ]);
  const [fullscreenImageId, setFullscreenImageId] = useState(null);

  const renderMessageList = () => (
    <View style={styles.content}>
      <MessageList messages={messages} onPressMessage={handlePressMessage} />
    </View>
  );

  const dismissFullscreenImage = () => {
    setFullscreenImageId(null);
  };

  const renderFullscreenImage = () => {
    if (!fullscreenImageId) return null;

    const image = messages.find(message => message.id === fullscreenImageId);
    if (!image) return null;

    const { uri } = image;

    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={dismissFullscreenImage}>
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };

  const renderInputMethodEditor = () => <View style={styles.inputMethodEditor}></View>;
  const renderToolbar = () => <View style={styles.toolbar}></View>;
  const handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                setMessages(messages.filter(message => message.id !== id));
              },
            },
          ]
        );
        break;
      case 'image':
        setFullscreenImageId(id);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Status />
      {renderMessageList()}
      {renderToolbar()}
      {renderInputMethodEditor()}
      {renderFullscreenImage()}
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
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});
