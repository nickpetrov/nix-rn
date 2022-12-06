// utils
import React from 'react';

// components
import {View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TooltipView from 'components/TooltipView';

// hooks
import {useSelector} from 'hooks/useRedux';

// styles
import {styles} from './BasketButton.styles';

interface BasketButtonProps {
  withCount?: boolean;
  onPress: () => void;
  icon: string;
}

const BasketButton: React.FC<BasketButtonProps> = props => {
  const foods = useSelector(state => state.basket.foods);
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <TooltipView
        eventName="firstLogin"
        step={2}
        parentWrapperStyle={styles.root}>
        {/* used without tooltip */}
        {/* <View style={styles.root}> */}
        {foods.length > 0 && props.withCount && (
          <View style={styles.badge}>
            <Text style={styles.text}>{foods.length}</Text>
          </View>
        )}
        <FontAwesome size={26} color={'white'} name={props.icon} />
        {/* </View> */}
      </TooltipView>
    </TouchableOpacity>
  );
};

export default BasketButton;
