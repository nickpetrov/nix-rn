// utils
import React from 'react';

// components
import {Text, TouchableHighlight, View, Image} from 'react-native';

// types
import {ExerciseProps} from 'store/userLog/userLog.types';

// styles
import {styles} from './ExerciseListItem.styles';
import {Colors} from 'constants/Colors';

interface ExerciseListItemProps {
  onPress?: () => void;
  exercise: ExerciseProps;
  last?: boolean;
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  onPress,
  exercise,
  last,
}) => {
  return (
    <TouchableHighlight
      underlayColor={Colors.Highlight}
      style={styles.container}
      disabled={!onPress}
      onPress={onPress}>
      <View style={[styles.root, !last ? styles.borderBottom : {}]}>
        <View style={styles.left}>
          <Image source={{uri: exercise.photo.thumb}} style={styles.image} />
          <View style={styles.header}>
            <Text>
              {exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)}
            </Text>
            <Text style={styles.time}>
              {exercise.name !== 'HealthKit Exercise Total'
                ? `${exercise.duration_min} min`
                : 'Daily Total'}
            </Text>
          </View>
        </View>
        <Text style={styles.calories}>
          -{exercise.nf_calories.toFixed(0)} Cal
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default ExerciseListItem;
