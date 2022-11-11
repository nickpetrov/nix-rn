// utils
import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import {useNavigation} from '@react-navigation/native';

// components
import {
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import {NixButton} from 'components/NixButton';
import RadioButton from 'components/RadioButton';

// constants
import {Colors} from 'constants/Colors';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {addWeightlog, updateWeightlog} from 'store/userLog/userLog.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {WeightProps} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './WeightModal.styles';

interface WeightModalProps {
  visible: boolean;
  setVisible: (v: null) => void;
  weight: WeightProps | null;
  selectedDate: string;
}

const WeightModal: React.FC<WeightModalProps> = ({
  visible,
  setVisible,
  weight,
  selectedDate,
}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<StackNavigatorParamList, Routes.Dashboard>
    >();
  const userData = useSelector(state => state.auth.userData);
  const [measureSystem, setMeasureSystem] = useState(userData.measure_system);
  const dispatch = useDispatch();
  const [value, setValue] = useState('');

  const handleSave = () => {
    const currentValue =
      measureSystem === 1 ? value : Math.round(parseFloat(value) / 2.20462);
    if (currentValue > 0) {
      if (weight?.id) {
        dispatch(updateWeightlog([{...weight, kg: +currentValue}])).then(() =>
          setVisible(null),
        );
      } else {
        dispatch(
          addWeightlog([
            {
              kg: +currentValue,
              timestamp: moment(selectedDate)
                .hours(moment().hours())
                .minutes(moment().minutes())
                .format(),
            },
          ]),
        ).then(() => setVisible(null));
      }
    }
  };

  useEffect(() => {
    setValue(
      String(
        userData.measure_system === 1
          ? weight?.kg || ''
          : Math.round(parseFloat(String(weight?.kg)) * 2.20462),
      ),
    );
    setMeasureSystem(userData.measure_system);
  }, [visible, weight, userData.measure_system]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onDismiss={() => setVisible(null)}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.root}>
        <View style={styles.weightModal}>
          <View style={styles.weightContainer}>
            <View style={styles.weightModalHeader}>
              <Text>Record Weight</Text>
            </View>
            <View style={styles.weightModalMain}>
              <TextInput
                style={styles.weightModalInput}
                value={value}
                onChangeText={(val: string) => setValue(val)}
                keyboardType="numeric"
              />
              <View style={styles.units}>
                <View style={styles.flex1}>
                  <Text>Units:</Text>
                </View>
                <RadioButton
                  selected={measureSystem === 1}
                  onPress={() => {
                    setMeasureSystem((prev: number) => {
                      if (prev !== 1 && value) {
                        const lbFromKg = Math.round(
                          parseFloat(value) / 2.20462,
                        );
                        setValue(String(lbFromKg));
                      }
                      return 1;
                    });
                  }}
                  text="kg"
                />
                <RadioButton
                  selected={measureSystem === 0}
                  onPress={() =>
                    setMeasureSystem((prev: number) => {
                      if (prev !== 0 && value) {
                        const kgFromLbs = Math.round(
                          parseFloat(value) * 2.20462,
                        );
                        setValue(String(kgFromLbs));
                      }
                      return 0;
                    })
                  }
                  text="lbs"
                />
              </View>
              <View style={styles.note}>
                <Text style={styles.noteText}>
                  You can also manage your unit settings in{' '}
                  <Text
                    style={{color: Colors.Info}}
                    onPress={() => {
                      setVisible(null);
                      navigation.navigate(Routes.Preferences);
                    }}>
                    Preference
                  </Text>
                </Text>
              </View>
              <View style={styles.weightModalButtons}>
                <View style={[styles.flex1, styles.mr8]}>
                  <NixButton title="Save" type="blue" onPress={handleSave} />
                </View>
                <View style={styles.flex1}>
                  <NixButton title="Cancel" onPress={() => setVisible(null)} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default WeightModal;
