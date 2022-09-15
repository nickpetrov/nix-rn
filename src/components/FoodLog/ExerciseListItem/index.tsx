// utils
import React from 'react';

// components
import {Text, TouchableOpacity, View} from 'react-native';

// styles
import {styles} from './ExerciseListItem.styles';

interface ExerciseListItemProps {
  onPress: () => void;
  exercise: any;
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  onPress,
  exercise,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.root}>
        <Text>{`${exercise.duration_min} min ${exercise.name}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExerciseListItem;
