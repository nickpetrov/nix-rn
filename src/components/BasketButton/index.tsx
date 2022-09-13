// utils
import React from 'react';

// components
import {View, Text, TouchableOpacity} from 'react-native';

// hooks
// import {useSelector} from 'hooks/useRedux';

// styles
import {styles} from './BasketButton.styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface BasketButtonProps {
  withCount?: boolean;
  onPress: () => void;
  icon: string;
}

const BasketButton: React.FC<BasketButtonProps> = props => {
  // const foods = useSelector(state => state.basket.foods);
  const foods = [];
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <View style={styles.root}>
        {foods.length > 0 && props.withCount && (
          <View style={styles.badge}>
            <Text style={styles.text}>{foods.length}</Text>
          </View>
        )}
        <FontAwesome size={26} color={'white'} name={props.icon} />
      </View>
    </TouchableOpacity>
  );
};

export default BasketButton;
