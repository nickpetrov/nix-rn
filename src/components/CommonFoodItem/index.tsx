// utils
import React from 'react';

// components
import {View, Text, Image, TouchableHighlight} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// styles
import {styles} from './CommonFoodItem.styles';

// constants
import {Colors} from 'constants/Colors';

interface CommonFoodItemProps {
  name?: string;
  text?: string;
  image?: string;
  onTap?: () => void;
  withArrow?: boolean;
  withoutBorder?: boolean;
}
const CommonFoodItem: React.FC<CommonFoodItemProps> = ({
  name,
  text,
  image,
  withArrow,
  onTap,
  withoutBorder,
}) => {
  return (
    <TouchableHighlight onPress={onTap}>
      <View style={[styles.foodItem, withoutBorder && styles.withoutBorder]}>
        {image && (
          <Image
            style={styles.foodThumb}
            source={{uri: image}}
            resizeMode="contain"
          />
        )}
        <View style={styles.flex1}>
          {name && <Text style={styles.foodName}>{name}</Text>}
          {text && <Text>{text}</Text>}
        </View>
        <View style={styles.right}>
          {withArrow && (
            <Ionicons
              style={styles.chevron}
              name="chevron-forward"
              color={Colors.Gray}
              size={25}
            />
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default CommonFoodItem;
