// utils
import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import {useNavigation} from '@react-navigation/native';

// components
import {View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {changeSelectedDay} from 'store/userLog/userLog.actions';

// helpers
import * as timeHelpers from 'helpers/time.helpers';

// styles
import {styles} from './FoodLogNavigation.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps} from 'store/userLog/userLog.types';

let goToTodayCounterTimeout: ReturnType<typeof setTimeout> | undefined;

interface FoodLogNavigationProps {
  foods: Array<FoodProps>;
  // scrollDirection: 'up' | 'down';
}

const FoodLogNavigation: React.FC<FoodLogNavigationProps> = ({foods}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<StackNavigatorParamList, Routes.Dashboard>
    >();
  const dispatch = useDispatch();
  // const timezone = useSelector(state => state.auth.userData.timezone);
  const {selectedDate} = useSelector(state => state.userLog);
  const [goToTodayCounter, setGoToTodayCounter] = useState(0);
  const currDate = moment(selectedDate).format('MM/DD');
  let weekDay = moment(selectedDate).format('dddd');
  if (
    moment().format('YYYY-MM-DD') ===
    moment(selectedDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
  ) {
    weekDay = 'Today';
  }

  useEffect(() => {
    if (weekDay === 'Today') {
      setGoToTodayCounter(0);
      return;
    }
    if (goToTodayCounter === 1) {
      clearTimeout(goToTodayCounterTimeout);
      goToTodayCounterTimeout = setTimeout(() => {
        setGoToTodayCounter(0);
      }, 1500);
    } else if (goToTodayCounter > 1) {
      clearTimeout(goToTodayCounterTimeout);
      dispatch(changeSelectedDay(timeHelpers.today()));
      setGoToTodayCounter(0);
    }
  }, [goToTodayCounter, dispatch, weekDay]);

  // const goToToday = () => {
  //   setGoToTodayCounter(goToTodayCounter + 1);
  // };

  const goToTotal = () => {
    navigation.navigate(Routes.Totals, {
      type: 'daily',
      foods: foods,
    });
  };

  const changeDate = (offset: number) => {
    setGoToTodayCounter(0);
    if (goToTodayCounterTimeout) {
      clearTimeout(goToTodayCounterTimeout);
    }
    const newDate = timeHelpers.offsetDays(selectedDate, 'YYYY-MM-DD', offset);
    dispatch(changeSelectedDay(newDate));
  };

  let foodLogNav = (
    <View style={styles.foodLogNav}>
      <TouchableOpacity onPress={() => changeDate(-1)}>
        <View style={styles.navAngleWrapperLeft}>
          <FontAwesome name="angle-left" size={34} color="#fff" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToTotal} style={styles.flex1}>
        <View style={styles.navTitleWrapper}>
          {goToTodayCounter > 0 ? (
            <View style={styles.gotoTodayDisclaimerWrapper}>
              <Text style={styles.gotoTodayDisclaimer}>
                Tap one more time to go to the Current day
              </Text>
            </View>
          ) : null}
          <Text style={styles.dayLogNavigationText}>
            <Text style={styles.dayLogNavHighlight}>{weekDay},</Text> {currDate}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeDate(1)}>
        <View style={styles.navAngleWrapperRight}>
          <FontAwesome name="angle-right" size={34} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );

  // if (scrollDirection === 'down') {
  //   foodLogNav = (
  //     <View style={styles.condensedFoodLogNav}>
  //       <Text style={styles.dayLogNavigationText}>
  //         <Text style={styles.dayLogNavHighlight}>{weekDay},</Text> {currDate}
  //       </Text>
  //     </View>
  //   );
  // }

  return foodLogNav;
};

export default FoodLogNavigation;
