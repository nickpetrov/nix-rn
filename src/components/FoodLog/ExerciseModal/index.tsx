// utils
import React, {useEffect, useState} from 'react';

// components
import {
  KeyboardAvoidingView,
  Modal,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {NixButton} from 'components/NixButton';
import VoiceInput from 'components/VoiceInput';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {
  addExerciseToLog,
  deleteExerciseFromLog,
  updateExerciseToLog,
} from 'store/userLog/userLog.actions';

// styles
import {styles} from './ExerciseModal.styles';

// types
import {ExerciseProps} from 'store/userLog/userLog.types';
import moment from 'moment';
import {analyticTrackEvent} from 'helpers/analytics.ts';

interface ExerciseModalProps {
  visible: boolean;
  setVisible: (v: null) => void;
  exercise: ExerciseProps | null;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  visible,
  setVisible,
  exercise,
}) => {
  const exercises = useSelector(state => state.userLog.exercises);
  const sortedExercises = exercises.sort((item: ExerciseProps) =>
    moment(item.timestamp).valueOf(),
  );
  const recent: string[] = [
    ...new Set(
      sortedExercises.map((item: ExerciseProps) =>
        item.duration_min
          ? `${item.duration_min} min ${item.name}`
          : `${item.name}`,
      ),
    ),
  ].slice(0, 3) as string[];
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [excerciseDescription, setExcerciseDescription] = useState('');

  const handleSave = () => {
    if (excerciseDescription) {
      setIsLoading(true);
      if (exercise?.id) {
        updateExerciseToLog;
        dispatch(updateExerciseToLog(excerciseDescription, exercise))
          .then(() => {
            setIsLoading(false);
            setVisible(null);
          })
          .catch(() => {
            setIsLoading(false);
          });
      } else {
        analyticTrackEvent('loggedExercise', excerciseDescription);
        dispatch(addExerciseToLog(excerciseDescription))
          .then(() => {
            setIsLoading(false);
            setVisible(null);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    }
  };

  const hadnleDelete = () => {
    setIsLoading(true);
    dispatch(deleteExerciseFromLog([{id: exercise?.id || '-1'}]))
      .then(() => {
        setIsLoading(false);
        setVisible(null);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setExcerciseDescription(
      exercise?.duration_min
        ? `${exercise?.duration_min} min ${exercise?.name}`
        : `${exercise?.name}` || '',
    );
  }, [visible, exercise]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onDismiss={() => {
        setVisible(null);
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.root}>
        <View style={styles.excerciseModal}>
          <View style={styles.excerciseContainer}>
            <View style={styles.excerciseModalHeader}>
              <Text>{exercise?.id ? 'Edit Exercise' : 'Log Exercises'}</Text>
            </View>
            <View style={styles.excerciseModalMain}>
              <VoiceInput
                style={styles.excerciseModalInput}
                placeholder={`Type or speak an exercise:
  - 45min spinning class
  - run 3 miles
  - walked 30 mins
  - 350 cal`}
                value={excerciseDescription}
                onChangeText={(value: string) => setExcerciseDescription(value)}
                disabled={isLoading}
              />
              <View>
                <Text>Recent Exercises:</Text>
                {recent.map((item: string) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.recent}
                    onPress={() =>
                      dispatch(addExerciseToLog(item))
                        .then(() => setVisible(null))
                        .catch(err => console.log(err))
                    }
                    disabled={isLoading}>
                    <Text style={styles.recentText}>{item}</Text>
                    <FontAwesome name="plus" color="#ccc" size={15} />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.excerciseModalButtons}>
                {exercise?.id && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => hadnleDelete()}
                    disabled={isLoading}>
                    <FontAwesome name="trash" color="#fff" size={15} />
                  </TouchableOpacity>
                )}
                <View style={[styles.btnContainer, styles.mr8]}>
                  <NixButton
                    title="Cancel"
                    onPress={() => {
                      setVisible(null);
                    }}
                  />
                </View>
                <View style={styles.btnContainer}>
                  <NixButton
                    title="Save"
                    type="blue"
                    disabled={isLoading}
                    onPress={handleSave}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ExerciseModal;
