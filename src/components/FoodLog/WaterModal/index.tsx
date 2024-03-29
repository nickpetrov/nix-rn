// utils
import React, {useEffect, useState} from 'react';

// components
import {
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {NixButton} from 'components/NixButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions

// types
import {TotalProps} from 'store/userLog/userLog.types';

// styles
import {styles} from './WaterModal.styles';
import {addWaterlog, updateWaterlog} from 'store/userLog/userLog.actions';
import {Colors} from 'constants/Colors';
import {analyticTrackEvent} from 'helpers/analytics.ts';

interface WaterModalProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  selectedDate: string;
}

const WaterModal: React.FC<WaterModalProps> = ({
  visible,
  setVisible,
  selectedDate,
}) => {
  const measure_system = useSelector(
    state => state.auth.userData.measure_system,
  );
  const totals = useSelector(state => state.userLog.totals);
  const consumedWater = totals.find(
    (item: TotalProps) => item.date === selectedDate,
  )?.water_consumed_liter;
  const dispatch = useDispatch();
  const [customValue, setCustomValue] = useState('');
  const [totalValue, setTotalValue] = useState(
    consumedWater ? String(consumedWater) : '',
  );
  const [isLoading, setIsLoading] = useState(false);

  const commonValues = [
    {
      id: 1,
      text: measure_system === 1 ? '0.25 L' : '8 oz',
      value: measure_system === 1 ? 0.25 : 8,
    },
    {
      id: 2,
      text: measure_system === 1 ? '0.33 L' : '16 oz',
      value: measure_system === 1 ? 0.33 : 16,
    },
    {
      id: 3,
      text: measure_system === 1 ? '0.5 L' : '24 oz',
      value: measure_system === 1 ? 0.5 : 24,
    },
    {
      id: 4,
      text: measure_system === 1 ? '1 L' : '32 oz',
      value: measure_system === 1 ? 1 : 32,
    },
  ];

  const handleAdd = (value: number) => {
    if (value) {
      setIsLoading(true);
      const unit = measure_system === 1 ? 'L' : 'oz';
      analyticTrackEvent('addedWater', value + ' ' + unit);
      dispatch(
        addWaterlog([
          {
            date: selectedDate,
            consumed: measure_system === 1 ? +value : +(value / 33.814),
          },
        ]),
      )
        .then(() => {
          setCustomValue('');
          setVisible(false);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };
  const handleEdit = (value: number) => {
    if (value) {
      setIsLoading(true);
      analyticTrackEvent('updatedWater', ' ');
      dispatch(
        updateWaterlog([
          {
            date: selectedDate,
            consumed: measure_system === 1 ? +value : +(value / 33.814),
          },
        ]),
      )
        .then(() => {
          setVisible(false);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    setTotalValue(
      consumedWater
        ? String(
            measure_system === 1
              ? consumedWater
              : (consumedWater * 33.814)?.toFixed(),
          )
        : '',
    );
  }, [visible, consumedWater, measure_system]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onDismiss={() => setVisible(false)}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.root}>
        <View style={styles.waterModal}>
          <View style={styles.waterContainer}>
            <View style={styles.waterModalHeader}>
              <Ionicons
                style={styles.icon}
                name="water"
                color={Colors.Blue}
                size={16}
              />
              <Text>Log Water</Text>
            </View>
            <View style={styles.content}>
              <View style={styles.common}>
                <Text style={styles.commonTitle}>
                  Common Measure (tap to add instantly):
                </Text>
                <View style={styles.commonList}>
                  {commonValues.map(item => (
                    <TouchableOpacity
                      style={styles.commonBuble}
                      key={item.id}
                      disabled={isLoading}
                      onPress={() => handleAdd(item.value)}>
                      <Text style={styles.commonBubleText}>{item.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.column}>
                  <Text style={styles.commonTitle}>Custom Measure:</Text>
                  <View style={styles.row}>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={customValue}
                        onChangeText={setCustomValue}
                        keyboardType="numeric"
                        editable={!isLoading}
                      />
                      <Text>{measure_system === 1 ? 'L' : 'oz'}</Text>
                    </View>
                    <NixButton
                      title="Add"
                      type="blue"
                      disabled={isLoading}
                      onPress={() => handleAdd(+customValue)}
                    />
                  </View>
                </View>
                <View style={[styles.column, styles.borderTop, styles.mt20]}>
                  <Text style={styles.totalTitle}>
                    Total water consumed today:
                  </Text>
                  <View style={styles.row}>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={totalValue}
                        onChangeText={setTotalValue}
                        keyboardType="numeric"
                        editable={!isLoading}
                      />
                      <Text>{measure_system === 1 ? 'L' : 'oz'}</Text>
                    </View>
                    <NixButton
                      title="Update"
                      type="blue"
                      disabled={isLoading}
                      onPress={() => handleEdit(+totalValue)}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.footer}>
                <NixButton
                  title="Cancel"
                  type="gray"
                  onPress={() => setVisible(false)}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default WaterModal;
