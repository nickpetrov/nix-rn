// utils
import React, {useState} from 'react';
import moment from 'moment-timezone';

// components
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';

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
  const [showControls, setShowControls] = useState(false);
  const [showDatePicker, setShowDatepicker] = useState(false);
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
      props.onDateChange(newDate.toDateString());
    }
  };

  const toggleDatePicker = () => {
    setShowDatepicker(true);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.titleWrapper}
        onPress={() => setShowControls(!showControls)}>
        <Text style={styles.title}>When:</Text>
        <Text style={styles.date}>
          {moment(currentDate).format('ddd, MM/DD/YYYY')},{' '}
          {guessMealNameByType(mealType)}
        </Text>
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
                style={styles.mealTypeButton}
                onTouchStart={() => onMealTypeChange(mealTypes.Breakfast)}>
                <Text>
                  Breakfast{mealType == mealTypes.Breakfast ? '*' : ''}
                </Text>
              </View>
              <View
                style={styles.mealTypeButton}
                onTouchStart={() => onMealTypeChange(mealTypes.Lunch)}>
                <Text>Lunch{mealType == mealTypes.Lunch ? '*' : ''}</Text>
              </View>
              <View
                style={{...styles.mealTypeButton, borderRightWidth: 0}}
                onTouchStart={() => onMealTypeChange(mealTypes.Dinner)}>
                <Text>Dinner{mealType == mealTypes.Dinner ? '*' : ''}</Text>
              </View>
            </View>
            <View style={styles.controlsRow}>
              <View
                style={styles.mealTypeButton}
                onTouchStart={() => onMealTypeChange(mealTypes['AM Snack'])}>
                <Text>
                  AM Snack{mealType == mealTypes['AM Snack'] ? '*' : ''}
                </Text>
              </View>
              <View
                style={styles.mealTypeButton}
                onTouchStart={() => onMealTypeChange(mealTypes['PM Snack'])}>
                <Text>
                  PM Snack{mealType == mealTypes['PM Snack'] ? '*' : ''}
                </Text>
              </View>
              <View
                style={{...styles.mealTypeButton, borderRightWidth: 0}}
                onTouchStart={() => onMealTypeChange(mealTypes['Late Snack'])}>
                <Text>
                  Late Snack{mealType == mealTypes['Late Snack'] ? '*' : ''}
                </Text>
              </View>
            </View>
          </View>
          {!showDatePicker ? (
            <View style={styles.dateWrapper}>
              <View
                style={styles.dateButton}
                onTouchStart={() => onDateChange(-1)}>
                <Text>
                  Yesterday
                  {currentDate ==
                  timeHelper.offsetDays(timeHelper.today(), '', -1)
                    ? '*'
                    : ''}
                </Text>
              </View>
              <View
                style={styles.dateButton}
                onTouchStart={() => onDateChange(0)}>
                <Text>Today{currentDate == timeHelper.today() ? '*' : ''}</Text>
              </View>
              <View
                style={styles.dateButton}
                onTouchStart={() => toggleDatePicker()}>
                <Text>Choose a day</Text>
              </View>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <DatePicker
                date={date as Date}
                onDateChange={(x: Date) => onDateChange(x)}
              />
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default WhenSection;
