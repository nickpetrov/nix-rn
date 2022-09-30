// utils
import React from 'react';

// componnts
import {View, Text, TouchableOpacity} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';

// styles
import {styles} from './SwipeView.styles';

type ButtonType = {
  type: 'copy' | 'delete';
  onPress: () => void;
};

interface SwipeViewProps {
  children: React.ReactNode;
  buttons: Array<ButtonType>;
  listKey?: string;
}

const SwipeView: React.FC<SwipeViewProps> = ({buttons, listKey, children}) => {
  const getButton = (item: ButtonType) => {
    switch (item.type) {
      case 'copy':
        return (
          <TouchableOpacity
            key={item.type}
            onPress={item.onPress}
            style={[styles.btn, styles.bgGreen]}>
            <Text style={styles.btnText}>Copy</Text>
          </TouchableOpacity>
        );
      case 'delete':
        return (
          <TouchableOpacity
            onPress={item.onPress}
            style={[styles.btn, styles.bgRed]}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        );

      default:
        break;
    }
  };
  return (
    <SwipeListView
      listKey={listKey}
      data={[{}]}
      renderItem={() => <>{children}</>}
      disableRightSwipe
      renderHiddenItem={() => (
        <View style={styles.renderItems}>
          {buttons.map(item => {
            return (
              <React.Fragment key={item.type}>{getButton(item)}</React.Fragment>
            );
          })}
        </View>
      )}
      swipeToOpenPercent={30}
      rightOpenValue={-(buttons.length * 75)}
    />
  );
};

export default SwipeView;
