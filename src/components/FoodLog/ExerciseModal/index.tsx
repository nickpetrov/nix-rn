// utils
import React, {useEffect, useState} from 'react';

// components
import {KeyboardAvoidingView, Modal, Text, View, Platform} from 'react-native';
import {NixButton} from 'components/NixButton';
import VoiceInput from 'components/VoiceInput';

// hooks
import {useDispatch} from 'hooks/useRedux';

// actions
import {
  addExerciseToLog,
  RefreshLog,
  updateExerciseToLog,
} from 'store/userLog/userLog.actions';

// styles
import {styles} from './ExerciseModal.styles';

// types
import {ExerciseProps} from 'store/userLog/userLog.types';

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
  const dispatch = useDispatch();
  const [excerciseDescription, setExcerciseDescription] = useState('');

  const handleSave = () => {
    if (excerciseDescription) {
      if (exercise?.id) {
        updateExerciseToLog;
        dispatch(updateExerciseToLog(excerciseDescription, exercise)).then(
          () => {
            dispatch(RefreshLog());
            setVisible(null);
          },
        );
      } else {
        dispatch(addExerciseToLog(excerciseDescription)).then(() => {
          dispatch(RefreshLog());
          setVisible(null);
        });
      }
    }
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
      animationType="slide"
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
              <Text>Log Exircises</Text>
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
              />
              <View>
                <Text>Recent Exercises:</Text>
              </View>
              <View style={styles.excerciseModalButtons}>
                <View style={[styles.btnContainer, styles.mr8]}>
                  <NixButton title="Save" type="primary" onPress={handleSave} />
                </View>
                <View style={styles.btnContainer}>
                  <NixButton
                    title="Cancel"
                    onPress={() => {
                      setVisible(null);
                    }}
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
