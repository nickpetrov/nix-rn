// utils
import React from 'react';

// components
import {Text, TouchableHighlight} from 'react-native';

// styles
import {styles} from './WaterListItem.styles';
import {Colors} from 'constants/Colors';

export interface WaterListItemProps {
  text: string;
  onPress: () => void;
}

const WaterListItem: React.FC<WaterListItemProps> = props => {
  return (
    <TouchableHighlight
      underlayColor={Colors.Highlight}
      style={styles.root}
      onPress={props.onPress}>
      <Text style={styles.text}>{props.text || 0} L</Text>
    </TouchableHighlight>
  );
};

export default WaterListItem;
