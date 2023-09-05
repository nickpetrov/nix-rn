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
  calculatorVersion: number | null;
}

const RestaurantItem: React.FC<RestaurantItemProps> = props => {

  const CalculatorIcon = (props: { isWithCalc: any; calculatorVersion: number | null; }) => {
    if (props.isWithCalc) {
      return (
        <FontAwesome
          name="calculator"
          size={20}
          color={2 === props.calculatorVersion ? '#57A61B' : '#6ca6e8'}
          style={styles.icon}
        />
      );
    }
    return null;
  };

  return (
    <TouchableWithoutFeedback onPress={() => props.onPress()}>
      <View style={styles.root}>
        <Image
          style={styles.image}
          source={{uri: props.logo}}
          resizeMode="contain"
        />
        <Text style={styles.text}>{props.name}</Text>
          <CalculatorIcon
            isWithCalc={props.isWithCalc}
            calculatorVersion={props.calculatorVersion}
          />
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
