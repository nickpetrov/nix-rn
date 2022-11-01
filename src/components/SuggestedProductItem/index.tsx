// utils
import React from 'react';

// components
import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

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
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{uri: item.image_thumb}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.header}>{item.item_name}</Text>
          <Text style={styles.brand}>{item.brand_name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View style={styles.icon}>
          <Ionicon name="ios-chevron-forward" size={30} color="#ddd" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SuggestedProductItem;
