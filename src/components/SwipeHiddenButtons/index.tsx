import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {styles} from './SwipeHiddenButtons.styles';

export type SwipeHidderButtonProps = {
  type: 'copy' | 'delete';
  onPress: () => void;
};

interface SwipeHiddenButtonsProps {
  buttons: Array<SwipeHidderButtonProps>;
}

const SwipeHiddenButtons: React.FC<SwipeHiddenButtonsProps> = ({buttons}) => {
  return (
    <View style={styles.hiddenItems}>
      {buttons.map((item: SwipeHidderButtonProps) => {
        if (item.type === 'copy') {
          return (
            <TouchableOpacity
              key={item.type}
              onPress={() => item.onPress()}
              style={[styles.btn, styles.bgCopy]}>
              <Text style={styles.btnText}>Copy</Text>
            </TouchableOpacity>
          );
        } else if (item.type === 'delete') {
          return (
            <TouchableOpacity
              key={item.type}
              onPress={() => item.onPress()}
              style={[styles.btn, styles.bgRed]}>
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
};

export default SwipeHiddenButtons;
