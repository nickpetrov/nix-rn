// utils
import React from 'react';
import moment from 'moment-timezone';

// components
import {Text, TouchableHighlight} from 'react-native';

// styles
import {styles} from './WeighInListItem.styles';
import {Colors} from 'constants/Colors';

// types
import {WeightProps} from 'store/userLog/userLog.types';

export interface WeighInListItemProps {
  item: WeightProps;
  measure_system: number;
  onPress: () => void;
}

const WeighInListItem: React.FC<WeighInListItemProps> = ({
  item,
  measure_system,
  onPress,
}) => {
  return (
    <TouchableHighlight
      underlayColor={Colors.Highlight}
      style={styles.root}
      onPress={onPress}>
      <Text style={styles.text}>{`${moment
        .utc(item.timestamp)
        .local()
        .format('h:mm a')}   ${
        measure_system === 1
          ? `${item.kg ? item.kg?.toFixed(1) : 0} kg`
          : `${Math.round(parseFloat(String(item.kg)) * 2.20462)} lbs`
      }`}</Text>
    </TouchableHighlight>
  );
};

export default WeighInListItem;
