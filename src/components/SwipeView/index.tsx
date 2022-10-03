// utils
import React from 'react';

// componnts
import {View, Text, TouchableOpacity} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';

// styles
import {styles} from './SwipeView.styles';

type ButtonType = {
  type: 'copy' | 'delete';
  keyId: string;
  onPress: (id: string) => void;
};

interface SwipeViewProps {
  buttons: Array<ButtonType>;
  listKey?: string;
  data: any;
  renderItem: (data: any) => JSX.Element | null;
}

const SwipeView: React.FC<SwipeViewProps> = ({
  buttons,
  data,
  renderItem,
  listKey,
}) => {
  const getButton = (item: ButtonType, id: string) => {
    switch (item.type) {
      case 'copy':
        return (
          <TouchableOpacity
            key={item.type}
            onPress={() => item.onPress(id)}
            style={[styles.btn, styles.bgCopy]}>
            <Text style={styles.btnText}>Copy</Text>
          </TouchableOpacity>
        );
      case 'delete':
        return (
          <TouchableOpacity
            onPress={() => item.onPress(id)}
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
      useFlatList
      listKey={listKey}
      keyExtractor={(n: any) => n.id || n.basketId}
      data={data}
      renderItem={renderItem}
      disableRightSwipe
      renderHiddenItem={(el: any) => (
        <View style={styles.renderItems}>
          {buttons.map(item => {
            return (
              <React.Fragment key={item.type}>
                {getButton(item, el.item[item.keyId])}
              </React.Fragment>
            );
          })}
        </View>
      )}
      onRowOpen={(rowKey, rowMap) => {
        setTimeout(() => {
          if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
          }
        }, 2000);
      }}
      swipeToOpenPercent={30}
      rightOpenValue={-(buttons.length * 75)}
    />
  );
};

export default SwipeView;
