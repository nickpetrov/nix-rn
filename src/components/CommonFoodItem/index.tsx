// utils
import React from 'react';

// components
import {View, Image, TouchableHighlight} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HighlightText from 'components/HighlightText';

// styles
import {styles} from './CommonFoodItem.styles';

// constants
import {Colors} from 'constants/Colors';

// helpers
import {capitalize} from 'helpers/foodLogHelpers';

interface CommonFoodItemProps {
  name?: string;
  text?: string;
  image?: string;
  onTap?: () => void;
  withArrow?: boolean;
  withoutBorder?: boolean;
  searchValue?: string;
}
const CommonFoodItem: React.FC<CommonFoodItemProps> = ({
  name,
  text,
  image,
  withArrow,
  onTap,
  withoutBorder,
  searchValue,
}) => {
  return (
    <TouchableHighlight onPress={onTap}>
      <View style={[styles.foodItem, withoutBorder && styles.withoutBorder]}>
        {!!image && (
          <Image
            style={styles.foodThumb}
            source={{uri: image}}
            resizeMode="contain"
          />
        )}
        <View style={styles.flex1}>
          {!!name && (
            <HighlightText
              searchWords={[searchValue || '']}
              textToHighlight={capitalize(name)}
              style={styles.foodName}
              highlightStyle={{fontWeight: '600'}}
            />
          )}
          {!!text && (
            <HighlightText
              searchWords={[searchValue || '']}
              textToHighlight={capitalize(text)}
              highlightStyle={{fontWeight: '600'}}
            />
          )}
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
