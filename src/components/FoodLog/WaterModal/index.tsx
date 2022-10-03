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

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions

// types
import {TotalProps} from 'store/userLog/userLog.types';

// styles
import {styles} from './WaterModal.styles';
import {addWaterlog, updateWaterlog} from 'store/userLog/userLog.actions';

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
  const totals = useSelector(state => state.userLog.totals);
  const consumedWater = totals.find(
    (item: TotalProps) => item.date === selectedDate,
  )?.water_consumed_liter;
  const dispatch = useDispatch();
  const [customValue, setCustomValue] = useState('');
  const [totalValue, setTotalValue] = useState(
    consumedWater ? String(consumedWater) : '',
  );

  const commonValues = [
    {
      id: 1,
      text: '0.25 L',
      value: 0.25,
    },
    {
      id: 2,
      text: '0.33 L',
      value: 0.33,
    },
    {
      id: 3,
      text: '0.5 L',
      value: 0.5,
    },
    {
      id: 4,
      text: '1 L',
      value: 1,
    },
  ];

  const handleAdd = (value: number) => {
    if (value) {
      dispatch(addWaterlog([{date: selectedDate, consumed: +value}])).then(
        () => {
          setCustomValue('');
        },
      );
    }
  };
  const handleEdit = (value: number) => {
    if (value) {
      dispatch(updateWaterlog([{date: selectedDate, consumed: +value}]));
    }
  };

  useEffect(() => {
    setTotalValue(consumedWater ? String(consumedWater) : '');
  }, [visible, consumedWater]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onDismiss={() => setVisible(false)}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.root}>
        <View style={styles.waterModal}>
          <View style={styles.waterContainer}>
            <View style={styles.waterModalHeader}>
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
                      />
                      <Text>L</Text>
                    </View>
                    <NixButton
                      title="Add"
                      type="facebook"
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
                      />
                      <Text>L</Text>
                    </View>
                    <NixButton
                      title="Update"
                      type="facebook"
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
