// utils
import React from 'react';

// components
import {Text, TouchableHighlight} from 'react-native';

// styles
import {styles} from './WaterListItem.styles';
import {Colors} from 'constants/Colors';

export interface WaterListItemProps {
  consumed: number;
  measure_system: number;
  onPress?: () => void;
}

const WaterListItem: React.FC<WaterListItemProps> = props => {
  return (
    <TouchableHighlight
      underlayColor={Colors.Highlight}
      style={styles.root}
      disabled={!props.onPress}
      onPress={props.onPress}>
      <Text style={styles.text}>
        {props.measure_system === 1
          ? `${props.consumed || 0} L`
          : `${(props.consumed * 33.814)?.toFixed()} oz`}
      </Text>
    </TouchableHighlight>
  );
};

export default WaterListItem;
