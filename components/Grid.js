import React from 'react';
import { Dimensions, FlatList, PixelRatio, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default function Grid(props) {
  const renderGridItem = info => {
    const { numColumns, itemMargin, renderItem } = props;
    const { width } = Dimensions.get('window');

    const size = PixelRatio.roundToNearestPixel(width - itemMargin * (numColumns - 1)) / numColumns;

    // We don't want to include a `marginLeft` on the first item of a row
    const marginLeft = index % numColumns === 0 ? 0 : itemMargin;

    // We don't want to include a `marginTop` on the first row of the
    const marginTop = index < numColumns ? 0 : itemMargin;

    return renderItem({ ...info, size, marginLeft, marginTop });
  };

  return <FlatList {...props} renderItem={renderGridItem} />;
}

Grid.propTypes = {
  renderItem: PropTypes.func.isRequired,
  numColumns: PropTypes.number,
  itemMargin: PropTypes.number,
};

Grid.defaultProps = {
  numColumns: 4,
  itemMargin: StyleSheet.hairlineWidth,
};
