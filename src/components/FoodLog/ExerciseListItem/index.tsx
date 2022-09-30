// utils
import React from 'react';

// components
import {Text, TouchableHighlight, View, Image} from 'react-native';

// types
import {ExerciseProps} from 'store/userLog/userLog.types';

// styles
import {styles} from './ExerciseListItem.styles';

interface ExerciseListItemProps {
  onPress: () => void;
  exercise: ExerciseProps;
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  onPress,
  exercise,
}) => {
  return (
    <TouchableHighlight style={styles.container} onPress={onPress}>
      <View style={styles.root}>
        <View style={styles.left}>
          <Image source={{uri: exercise.photo.thumb}} style={styles.image} />
          <View style={styles.header}>
            <Text>
              {exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)}
            </Text>
            <Text style={styles.time}>{`${exercise.duration_min} min`}</Text>
          </View>
        </View>
        <Text style={styles.calories}>-{exercise.nf_calories} Cal</Text>
      </View>
    </TouchableHighlight>
  );
};

export default ExerciseListItem;
