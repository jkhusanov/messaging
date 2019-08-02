import React from 'react';
import { FlatList, StyleSheet, Image, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { Marker } from 'react-native-maps';

import { MessageShape } from '../utils/MessageUtils';

const keyExtractor = item => item.id.toString();

export default function MessageList({ messages, onPressMessage }) {
  // eslint-disable-next-line react/prop-types
  const renderMessageItem = ({ item }) => (
    // eslint-disable-next-line react/prop-types
    <View key={item.id} style={styles.messageRow}>
      <TouchableOpacity onPress={() => onPressMessage(item)}>
        {renderMessageBody(item)}
      </TouchableOpacity>
    </View>
  );

  // eslint-disable-next-line react/prop-types
  const renderMessageBody = ({ type, text, uri, coordinate }) => {
    switch (type) {
      case 'text':
        return (
          <View style={styles.messageBubble}>
            <Text style={styles.text}>{text}</Text>
          </View>
        );
      case 'image':
        return <Image style={styles.image} source={{ uri }} />;
      case 'location':
        return (
          <MapView
            style={styles.map}
            initialRegion={{ ...coordinate, latitudeDelta: 0.08, longitudeDelta: 0.04 }}
          >
            <Marker coordinate={coordinate} />
          </MapView>
        );
      default:
        return null;
    }
  };

  return (
    <FlatList
      style={styles.container}
      inverted
      data={messages}
      renderItem={renderMessageItem}
      keyExtractor={keyExtractor}
      keyboardShouldPersistTaps="handled"
    />
  );
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(MessageShape).isRequired,
  onPressMessage: PropTypes.func,
};

MessageList.defaultProps = {
  onPressMessage: () => {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // overflow: 'visible', // Prevents clipping on resize!
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
    marginRight: 10,
    marginLeft: 60,
  },
  messageBubble: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgb(16,135,255)',
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  map: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
});
