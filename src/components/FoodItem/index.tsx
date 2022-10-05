import React from 'react';
import {TouchableHighlight, View, Image, Text} from 'react-native';
import {styles} from './FoodItem.styles';

interface FoodItemProps {
  style?: {
    [key: string]: string | number;
  };
  name: string;
  calories: string;
  serving: string;
  image: string;
  onPress: () => void;
}

const FoodItem: React.FC<FoodItemProps> = ({
  name,
  serving,
  image,
  calories,
  onPress,
  style,
}) => {
  return (
    <TouchableHighlight style={[styles.root, style]} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.left}>
          <Image source={{uri: image}} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.serving}>{serving}</Text>
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text>{calories}</Text>
          <Text>Cal</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default FoodItem;
