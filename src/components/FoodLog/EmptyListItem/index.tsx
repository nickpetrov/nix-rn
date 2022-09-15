// utils
import React from 'react';

// components
import {View, Text} from 'react-native';

// styles
import {styles} from './EmptyListItem.styles';

export interface EmptyListItemProps {
  type?: string;
  text: string;
}

const EmptyListItem: React.FC<EmptyListItemProps> = props => {
  return (
    <View style={styles.noFoodsDisclaimerWrapper}>
      <Text
        style={
          props.type === 'full' ? styles.waterItem : styles.noFoodsDisclaimer
        }>
        {props.text}
      </Text>
    </View>
  );
};

export default EmptyListItem;
