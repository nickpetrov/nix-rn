// utils
import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';

// components
import {View, Text} from 'react-native';
import {NixButton} from 'components/NixButton';
import HeatMap from './components/HeatMap';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {getDayTotals} from 'store/stats/stats.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TotalProps} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './NixDietGraph.styles';

interface NixDietGraphProps {
  initialDisplayDate: number;
  title: string;
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Stats>;
  target: number;
  nutrientId?: number;
}

const NixDietGraph: React.FC<NixDietGraphProps> = props => {
  const dispatch = useDispatch();
  const dates = useSelector(state => state.stats.dates);
  const [monthOffset, setMonthOffset] = useState(0);
  const [startDate, setStartDate] = useState(
    moment(props.initialDisplayDate).startOf('month').format('YYYY-MM-DD'),
  );
  const [endDate, setEndDate] = useState(
    moment(props.initialDisplayDate).endOf('month').format('YYYY-MM-DD'),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    moment(props.initialDisplayDate).add(monthOffset, 'month').format('MMMM'),
  );
  const [firstWeekdayNumber, setFirstWeekdayNumber] = useState(
    moment(props.initialDisplayDate)
      .add(monthOffset, 'month')
      .startOf('month')
      .format('d'),
  );
  console.log(props.initialDisplayDate);
  const [daysInMonth, setDaysInMonth] = useState(
    moment(props.initialDisplayDate)
      .add(monthOffset, 'month')
      .endOf('month')
      .format('DD'),
  );
  const [values, setValues] = useState(new Array(parseInt(daysInMonth)));
  const [targets, setTargets] = useState(new Array(parseInt(daysInMonth)));

  const [trackedDays, setTrackedDays] = useState(0);
  const [greenDays, setGreenDays] = useState(0);

  // const disableNavigation = false;
  // let disablePrev = false;
  // let disableNext = false;

  const title = props.title || 'Diet Logging Graph';

  // const target = props.target || 2000;
  // const nutrientId = props.nutrientId || 208;

  useEffect(() => {
    setTrackedDays(0);
    setGreenDays(0);
    setStartDate(
      moment(props.initialDisplayDate)
        .add(monthOffset, 'month')
        .startOf('month')
        .format('YYYY-MM-DD'),
    );
    setEndDate(
      moment(props.initialDisplayDate)
        .add(monthOffset, 'month')
        .endOf('month')
        .format('YYYY-MM-DD'),
    );
    setSelectedMonth(
      moment(props.initialDisplayDate).add(monthOffset, 'month').format('MMMM'),
    );
    setFirstWeekdayNumber(
      moment(props.initialDisplayDate)
        .add(monthOffset, 'month')
        .startOf('month')
        .format('d'),
    );
    setDaysInMonth(
      moment(props.initialDisplayDate)
        .add(monthOffset, 'month')
        .endOf('month')
        .format('DD'),
    );
    setValues(new Array(parseInt(daysInMonth)));
    setTargets(new Array(parseInt(daysInMonth)));
  }, [monthOffset, daysInMonth, props.initialDisplayDate]);

  // const nutrientSettings = {
  //   208: {
  //     title: 'Calories',
  //     round: 'calories',
  //   },
  //   205: {
  //     title: 'Carb',
  //     round: 'total_carb',
  //   },
  //   204: {
  //     title: 'Fat',
  //     round: 'total_fat',
  //   },
  //   203: {
  //     title: 'Protein',
  //     round: 'protein',
  //   },
  //   307: {
  //     title: 'Sodium',
  //     round: 'sodium',
  //   },
  // }[nutrientId];

  useEffect(() => {
    dispatch(getDayTotals(startDate, endDate));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    dates.map((day: TotalProps) => {
      if (day.total_cal > 0 || day.total_cal_burned > 0) {
        let val = day.total_cal - day.total_cal_burned;
        setValues(prev => {
          prev[parseInt(moment(day.date).format('D')) - 1] = val;
          return prev;
        });
        setTargets(prev => {
          prev[parseInt(moment(day.date).format('D')) - 1] =
            day.daily_kcal_limit;
          return prev;
        });
        setTrackedDays(prev => prev + 1);
        setGreenDays(prev => prev + (val > day.daily_kcal_limit ? 0 : 1));
      } else {
        setValues(prev => {
          prev[parseInt(moment(day.date).format('D')) - 1] = 0;
          return prev;
        });
        setTargets(prev => {
          prev[parseInt(moment(day.date).format('D')) - 1] = 0;
          return prev;
        });
      }
    });
  }, [dates]);

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        <View style={styles.btnsContainer}>
          <View style={[styles.btn, styles.mr3]}>
            <NixButton
              iconName="chevron-left"
              type="calm"
              onPress={() => setMonthOffset(prevState => prevState - 1)}
            />
          </View>
          <View style={[styles.btn, styles.ml3]}>
            <NixButton
              iconName="chevron-right"
              type="calm"
              onPress={() => setMonthOffset(prevState => prevState + 1)}
            />
          </View>
        </View>
        <View style={styles.main}>
          <Text style={styles.text}>
            {selectedMonth}, {moment(startDate).format('YYYY')}
          </Text>
          <HeatMap
            targets={targets}
            values={values}
            skipFromStart={+firstWeekdayNumber - 1}
            daysInMonth={daysInMonth}
            selectedMonth={selectedMonth}
            navigation={props.navigation}
          />
        </View>
        <View style={styles.footer}>
          <View style={[styles.flex1, styles.alignCenter]}>
            <Text style={styles.footerCenteredText}>
              Total Days{'\n'}Tracked
            </Text>
            <Text style={[styles.textAlignCenter, styles.marginV10]}>
              {trackedDays} Days
            </Text>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.footerCenteredText}>Days{'\n'}Missed</Text>
            <Text style={[styles.textAlignCenter, styles.marginV10]}>
              {+daysInMonth - trackedDays} Days
            </Text>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.footerCenteredText}>% Days{'\n'}of Green</Text>
            <Text style={[styles.textAlignCenter, styles.marginV10]}>
              {trackedDays && greenDays ? (greenDays / trackedDays) * 100 : 0}%
            </Text>
          </View>
        </View>
        <Text style={styles.footerNote}>
          Tap on any date on the calendar to review or add foods.
        </Text>
      </View>
    </View>
  );
};

export default NixDietGraph;
