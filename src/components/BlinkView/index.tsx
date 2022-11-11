import React, {useEffect, useCallback, useMemo} from 'react';
import {Animated} from 'react-native';
import {Colors} from 'constants/Colors';

interface BlinkViewProps {
  children: React.ReactNode;
  animated: boolean;
  duration?: number;
  startColor?: string;
  endColor?: string;
  endCallback?: () => void;
  iterations?: number;
}

const BlinkView: React.FC<BlinkViewProps> = ({
  animated,
  children,
  duration,
  startColor,
  endColor,
  endCallback,
  iterations,
}) => {
  const value = useMemo(() => new Animated.Value(0), []);

  const trigger = useCallback(() => {
    value.setValue(0);
    Animated.loop(
      Animated.timing(value, {
        toValue: 3,
        duration: duration || 300,
        useNativeDriver: false,
      }),
      {
        iterations: iterations ? iterations : 1,
      },
    ).start(() => {
      endCallback && endCallback();
    });
  }, [value, duration, endCallback, iterations]);

  const color = value.interpolate({
    inputRange: [0, 0.5, 2.5, 3],
    outputRange: [
      startColor || Colors.Gray4,
      '#fff',
      endColor || 'green',
      startColor || Colors.Gray4,
    ],
  });

  useEffect(() => {
    if (animated) {
      trigger();
    }
  }, [animated, trigger]);

  return (
    <Animated.View
      style={[
        // {backgroundColor: startColor || Colors.Gray4},
        {backgroundColor: color},
      ]}>
      {children}
    </Animated.View>
  );
};

export default BlinkView;
