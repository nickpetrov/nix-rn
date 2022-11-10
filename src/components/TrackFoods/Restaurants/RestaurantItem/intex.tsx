// utils
import React from 'react';

// components
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

// styles
import {styles} from './RestaurantItem.styles';

interface RestaurantItemProps {
  onPress: () => void;
  name: string;
  logo: string;
  isWithCalc?: boolean;
}

const RestaurantItem: React.FC<RestaurantItemProps> = props => {
  return (
    <TouchableWithoutFeedback onPress={() => props.onPress()}>
      <View style={styles.root}>
        <Image
          style={styles.image}
          source={{uri: props.logo}}
          resizeMode="contain"
        />
        <Text style={styles.text}>{props.name}</Text>
        {props.isWithCalc ? (
          <FontAwesome
            name="calculator"
            size={20}
            color="#6ca6e8"
            style={styles.icon}
          />
        ) : null}
        <Ionicons
          style={styles.icon}
          name="ios-chevron-forward"
          color="#a1a1a1"
          size={25}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RestaurantItem;
