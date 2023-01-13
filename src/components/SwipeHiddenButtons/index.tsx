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
  style?: {
    [key: string]: string | number;
  };
}

const SwipeHiddenButtons: React.FC<SwipeHiddenButtonsProps> = ({
  buttons,
  style,
}) => {
  return (
    <View style={styles.hiddenItems}>
      {buttons.map((item: SwipeHidderButtonProps) => {
        if (item.type === 'copy') {
          return (
            <TouchableOpacity
              key={item.type}
              onPress={() => item.onPress()}
              style={[styles.btn, styles.bgCopy, style]}>
              <Text style={styles.btnText}>Copy</Text>
            </TouchableOpacity>
          );
        } else if (item.type === 'delete') {
          return (
            <TouchableOpacity
              key={item.type}
              onPress={() => item.onPress()}
              style={[styles.btn, styles.bgRed, style]}>
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
              style={[styles.btn, styles.bgBlue, style]}>
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
