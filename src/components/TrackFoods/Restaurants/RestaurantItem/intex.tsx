// utils
import React from 'react';

// components
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
            size={30}
            color="#6ca6e8"
            style={styles.icon}
          />
        ) : null}
        <FontAwesome
          name="angle-right"
          size={30}
          color="#a1a1a1"
          style={styles.icon}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RestaurantItem;
