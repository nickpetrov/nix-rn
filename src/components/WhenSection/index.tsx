// utils
import React, {useState} from 'react';
import moment from 'moment-timezone';

// components
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// helpers
import * as timeHelper from 'helpers/time.helpers';
import {guessMealNameByType} from 'helpers/foodLogHelpers';

// constants
import {mealTypes} from 'store/basket/basket.types';

// styles
import {styles} from './WhenSection.styles';

interface WhenSectionProps {
  consumed_at: string;
  meal_type: mealTypes;
  onMealTypeChange: (newMealType: mealTypes) => void;
  onDateChange: (date: string) => void;
}

const WhenSection: React.FC<WhenSectionProps> = props => {
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const currentDate = props.consumed_at;
  const [date, setDate] = useState<Date | string>(new Date(currentDate));
  const [mealType, setMealType] = useState<mealTypes>(props.meal_type);

  const onMealTypeChange = (newMealType: mealTypes) => {
    setMealType(newMealType);
    return props.onMealTypeChange ? props.onMealTypeChange(newMealType) : null;
  };

  const onDateChange = (newDate: Date | 0 | -1) => {
    if (newDate === 0) {
      props.onDateChange(timeHelper.today());
    } else if (newDate === -1) {
      props.onDateChange(timeHelper.offsetDays(timeHelper.today(), '', -1));
    } else {
      setDate(newDate);
      // was  - props.onDateChange(newDate)
      props.onDateChange(moment(newDate).format('YYYY-MM-DD'));
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.titleWrapper}
        onPress={() => setShowControls(!showControls)}>
        <View style={styles.titleTextWrapper}>
          <Text style={styles.title}>When:</Text>
          <Text style={styles.date}>
            {currentDate === timeHelper.offsetDays(timeHelper.today(), '', -1)
              ? 'Yesterday'
              : currentDate === timeHelper.today()
              ? 'Today'
              : moment(currentDate).format('ddd, MM/DD/YYYY')}
            , {guessMealNameByType(mealType)}
          </Text>
        </View>
        <FontAwesome name="pencil" size={15} />
      </TouchableOpacity>
      {showControls ? (
        <View style={styles.controlsWrapper}>
          <View style={styles.mealTypeWrapper}>
            <View
              style={{
                ...styles.controlsRow,
                borderBottomWidth: 1,
                borderBottomColor: '#bbb',
              }}>
              <View
                style={[
                  styles.mealTypeButton,
                  mealType === mealTypes.Breakfast && styles.choosed,
                ]}
                onTouchStart={() => onMealTypeChange(mealTypes.Breakfast)}>
                <Text>Breakfast</Text>
              </View>
              <View
                style={[
                  styles.mealTypeButton,
                  mealType === mealTypes.Lunch && styles.choosed,
                ]}
                onTouchStart={() => onMealTypeChange(mealTypes.Lunch)}>
                <Text>Lunch</Text>
              </View>
              <View
                style={[
                  {...styles.mealTypeButton, borderRightWidth: 0},
                  mealType === mealTypes.Dinner && styles.choosed,
                ]}
                onTouchStart={() => onMealTypeChange(mealTypes.Dinner)}>
                <Text>Dinner</Text>
              </View>
            </View>
            <View style={styles.controlsRow}>
              <View
                style={[
                  styles.mealTypeButton,
                  mealType === mealTypes['AM Snack'] && styles.choosed,
                ]}
                onTouchStart={() => onMealTypeChange(mealTypes['AM Snack'])}>
                <Text>AM Snack</Text>
              </View>
              <View
                style={[
                  styles.mealTypeButton,
                  mealType === mealTypes['PM Snack'] && styles.choosed,
                ]}
                onTouchStart={() => onMealTypeChange(mealTypes['PM Snack'])}>
                <Text>PM Snack</Text>
              </View>
              <View
                style={[
                  {...styles.mealTypeButton, borderRightWidth: 0},
                  mealType === mealTypes['Late Snack'] && styles.choosed,
                ]}
                onTouchStart={() => onMealTypeChange(mealTypes['Late Snack'])}>
                <Text>Late Snack</Text>
              </View>
            </View>
          </View>
          <View style={styles.dateWrapper}>
            <View
              style={[
                styles.dateButton,
                currentDate ===
                  timeHelper.offsetDays(timeHelper.today(), '', -1) &&
                  styles.choosed,
              ]}
              onTouchStart={() => onDateChange(-1)}>
              <Text>Yesterday</Text>
            </View>
            <View
              style={[
                styles.dateButton,
                currentDate === timeHelper.today() && styles.choosed,
              ]}
              onTouchStart={() => onDateChange(0)}>
              <Text>Today</Text>
            </View>
            <View
              style={[
                styles.dateButton,
                currentDate !== timeHelper.today() &&
                  currentDate !==
                    timeHelper.offsetDays(timeHelper.today(), '', -1) &&
                  styles.choosed,
              ]}
              onTouchStart={() => setOpenTimeModal(true)}>
              <Text>Choose a day</Text>
            </View>
          </View>
          <DatePicker
            date={date as Date}
            androidVariant="nativeAndroid"
            mode="date"
            modal
            open={openTimeModal}
            onConfirm={(x: Date) => {
              setOpenTimeModal(false);
              onDateChange(x);
            }}
            onCancel={() => {
              setOpenTimeModal(false);
            }}
            title={null}
          />
        </View>
      ) : null}
    </View>
  );
};

export default WhenSection;
