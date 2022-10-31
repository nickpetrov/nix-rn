import React, {useEffect, useCallback, useMemo} from 'react';
import {Animated} from 'react-native';
import {Easing} from 'react-native-reanimated';

interface ShakeViewProps {
  children: React.ReactNode;
  animated: boolean;
}

const ShakeView: React.FC<ShakeViewProps> = ({animated, children}) => {
  const value = useMemo(() => new Animated.Value(0), []);

  const trigger = useCallback(() => {
    value.setValue(0);
    Animated.timing(value, {
      toValue: 3,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
  }, [value]);

  const shake = value.interpolate({
    inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
    outputRange: [0, -10, 0, 10, 0, -10, 0],
  });

  useEffect(() => {
    if (animated) {
      trigger();
    }
  }, [animated, trigger]);

  return (
    <Animated.View style={[{transform: [{translateX: shake}]}]}>
      {children}
    </Animated.View>
  );
};

export default ShakeView;
