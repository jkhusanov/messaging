import React, { useState } from 'react';
import { CameraRoll, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Permissions } from 'expo';
import PropTypes from 'prop-types';

import Grid from './Grid';

const keyExtractor = ({ uri }) => uri;

const renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {
  const style = { width: size, height: size, marginLeft, marginTop };

  return <Image source={{ uri }} style={style} />;
};

export default function ImageGrid() {
  const [images, setImages] = useState([
    { uri: 'https://picsum.photos/600/600?image=10' },
    { uri: 'https://picsum.photos/600/600?image=20' },
    { uri: 'https://picsum.photos/600/600?image=30' },
    { uri: 'https://picsum.photos/600/600?image=40' },
  ]);

  return <Grid data={images} renderItem={renderItem} keyExtractor={keyExtractor} />;
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

ImageGrid.propTypes = {
  onPressImage: PropTypes.func,
};

ImageGrid.defaultProps = {
  onPressImage: () => {},
};

renderItem.propTypes = {
  item: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }).isRequired,
  size: PropTypes.number.isRequired,
  marginTop: PropTypes.number.isRequired,
  marginLeft: PropTypes.number.isRequired,
};
