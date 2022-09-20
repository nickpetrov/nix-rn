// utils
import React from 'react';

// components
import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// types
import {SuggestedFoodProps} from 'store/foods/foods.types';

// styles
import {styles} from './SuggestedProductItem.styles';

interface SuggestedProductItemProps {
  item: SuggestedFoodProps;
  onPress: () => void;
}

const SuggestedProductItem: React.FC<SuggestedProductItemProps> = ({
  item,
  onPress,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.root}>
        <View>
          <Image
            style={styles.image}
            source={{uri: item.image_thumb}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.header}>{item.item_name}</Text>
          <Text style={styles.text}>{item.brand_name}</Text>
          <Text>{item.description}</Text>
        </View>
        <View style={styles.icon}>
          <FontAwesome name="angle-right" size={50} color="#bebebe" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SuggestedProductItem;
