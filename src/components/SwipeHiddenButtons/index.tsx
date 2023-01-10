import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {styles} from './SwipeHiddenButtons.styles';

export type SwipeHidderButtonProps = {
  type: 'copy' | 'delete' | 'log';
  onPress: () => void;
  icon?: {
    name: string;
    size?: number;
    color?: string;
  };
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
              {item.icon ? (
                <FontAwesome
                  name={item.icon.name || 'trash'}
                  color={item.icon?.color || '#fff'}
                  size={item.icon?.size || 24}
                />
              ) : (
                <Text style={styles.btnText}>Delete</Text>
              )}
            </TouchableOpacity>
          );
        } else if (item.type === 'log') {
          return (
            <TouchableOpacity
              key={item.type}
              onPress={() => item.onPress()}
              style={[styles.btn, styles.bgBlue]}>
              <Text style={styles.btnText}>Quick Log</Text>
            </TouchableOpacity>
          );
        } else {
          return <></>;
        }
      })}
    </View>
  );
};

export default SwipeHiddenButtons;
