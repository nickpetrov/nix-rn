import React from 'react';

// components
import {Animated, View} from 'react-native';
import {Easing} from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {styles} from './LoadIndicator.styles';

interface LoadIndicatorProps {
  icon?: string;
  color?: string;
  size?: number;
  withShadow?: boolean;
}

const LoadIndicator: React.FC<LoadIndicatorProps> = ({
  icon,
  color,
  size,
  withShadow,
}) => {
  const spinValue = new Animated.Value(0);
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <View style={[styles.root, withShadow && styles.withShadow]}>
      <Animated.View style={[{transform: [{rotate: spin}]}]}>
        <FontAwesome
          name={icon || 'spinner'}
          color={color || '#fff'}
          size={size || 25}
        />
      </Animated.View>
    </View>
  );
};

export default LoadIndicator;
