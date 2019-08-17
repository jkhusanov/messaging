/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { CameraRoll, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import PropTypes from 'prop-types';

import Grid from './Grid';

const keyExtractor = ({ uri }) => uri;

const renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {
  const style = { width: size, height: size, marginLeft, marginTop };

  return <Image source={{ uri }} style={style} />;
};

export default function ImageGrid() {
  // const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [cursor, setCursor] = useState(null);
  let loading = false;
  // let cursor = null;
  useEffect(() => {
    async function getImages() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        console.log('Camera roll permission denied');
        return;
      }
      const results = await CameraRoll.getPhotos({
        first: 20,
        assetType: 'Photos',
        groupTypes: 'All',
      });
      const {
        edges,
        page_info: { has_next_page, end_cursor },
      } = results;
      const loadedImages = edges.map(item => item.node.image);

      setImages(loadedImages);
      setCursor(has_next_page ? end_cursor : null);
    }
    getImages();
  }, []);

  const getImages = async after => {
    if (loading) return;
    loading = true;
    const results = await CameraRoll.getPhotos({
      first: 20,
      after,
      assetType: 'Photos',
      groupTypes: 'All',
    });
    const {
      edges,
      page_info: { has_next_page, end_cursor },
    } = results;
    const loadedImages = edges.map(item => item.node.image);

    setImages(images.concat(loadedImages));
    loading = false;
    setCursor(has_next_page ? end_cursor : null);
  };

  const getNextImages = () => {
    if (!cursor) return;
    getImages(cursor);
  };

  return (
    <Grid
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={getNextImages}
    />
  );
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
