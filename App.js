import React, { useState, useEffect } from 'react';
import { StyleSheet, BackHandler, View, Alert, Image, TouchableHighlight } from 'react-native';
import Status from './components/Status';
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';
import ImageGrid from './components/ImageGrid';
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';

export default function App() {
  const [messages, setMessages] = useState([
    createImageMessage('https://picsum.photos/id/1043/500/500'),
    createTextMessage('World'),
    createTextMessage('Hello'),
    createLocationMessage({ latitude: 37.78825, longitude: -122.4324 }),
  ]);
  const [fullscreenImageId, setFullscreenImageId] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (fullscreenImageId) {
        dismissFullscreenImage();
        // We return true to indicate that we shouldn’t exit the app.
        return true;
      }
      // If we’re not showing a fullscreen image, we return false. Because no other handlers should be registered, this will allow for the default back button behavior (exiting the app).
      return false;
    });

    // Cleanup
    return () => {
      subscription.remove();
    };
  });

  const handlePressToolbarCamera = () => {
    // ...
  };

  const handlePressImage = uri => {
    setMessages([createImageMessage(uri), ...messages]);
  };

  const handlePressToolbarLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const {
        coords: { latitude, longitude },
      } = position;

      setMessages([createLocationMessage({ latitude, longitude }), ...messages]);
    });
  };

  const handleChangeFocus = isFocused => {
    setIsInputFocused(isFocused);
  };

  const handleSubmit = text => {
    setMessages([createTextMessage(text), ...messages]);
  };

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={handleSubmit}
          onChangeFocus={handleChangeFocus}
          onPressCamera={handlePressToolbarCamera}
          onPressLocation={handlePressToolbarLocation}
        />
      </View>
    );
  };

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

  const renderInputMethodEditor = () => (
    <View style={styles.inputMethodEditor}>
      <ImageGrid onPressImage={handlePressImage} />
    </View>
  );
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
        setIsInputFocused(false);
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
