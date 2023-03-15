// utils
import React, {useEffect, useState, useMemo, useCallback} from 'react';
import moment from 'moment-timezone';

// components
import {View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Calendar} from 'react-native-calendars';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {getDayTotals} from 'store/stats/stats.actions';
import {changeSelectedDay} from 'store/userLog/userLog.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './NixDietGraph.styles';

interface NixDietGraphProps {
  initialDisplayDate: string;
  title: string;
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Stats>;
}

const NixDietGraph: React.FC<NixDietGraphProps> = props => {
  const showMissedDays = true;
  const dispatch = useDispatch();
  const user_daily_kcal = useSelector(state => state.auth.userData.daily_kcal);
  const [currentDate, setCurrentDate] = useState(
    moment(props.initialDisplayDate).format('YYYY-MM-DD'),
  );
  const allDates = useSelector(state => state.stats.dates);

  const [trackedDays, setTrackedDays] = useState(0);
  const [greenDays, setGreenDays] = useState(0);
  const [missed, setMissed] = useState(0);

  const [markedDates, setMarkedDates] = useState<{[value: string]: any}>({});

  const title = props.title || 'Diet Logging Graph';

  const colorsArray = useMemo(
    () => [
      '#ededed',
      '#58a61c',
      '#88c25a',
      '#bbdca2',
      '#f29898',
      '#e64a48',
      '#dc0000',
    ],
    [],
  );

  const getFillColor = useCallback(
    (value: number, goal: number) => {
      const percent = Math.round((value / goal) * 100);
      let color = colorsArray[0];
      switch (true) {
        case percent >= 115:
          color = colorsArray[6];
          break;
        case percent >= 107.5:
          color = colorsArray[5];
          break;
        case percent >= 100:
          color = colorsArray[4];
          break;
        case percent >= 92.5:
          color = colorsArray[3];
          break;
        case percent >= 85:
          color = colorsArray[2];
          break;
        case percent > 0 && percent < 85:
        case value / goal > 0 && percent === 0:
        case value < 0:
          color = colorsArray[1];
          break;
        default:
          color = colorsArray[0];
      }
      return color;
    },
    [colorsArray],
  );

  useEffect(() => {
    dispatch(
      getDayTotals(
        moment(currentDate).startOf('month').format('YYYY-MM-DD'),
        moment(currentDate).endOf('month').format('YYYY-MM-DD'),
      ),
    );
  }, [dispatch, currentDate]);

  useEffect(() => {
    const startOfMonth = moment(currentDate)
      .startOf('month')
      .format('YYYY-MM-DD');
    const dates = allDates[startOfMonth];
    if (dates) {
      const newTrackedDays = dates.reduce((prev, curr) => {
        const val = curr.total_cal > 0 || curr.total_cal_burned > 0 ? 1 : 0;
        return prev + val;
      }, 0);
      const newGreenDays = dates.reduce((prev, curr) => {
        if (curr.total_cal > 0 || curr.total_cal_burned > 0) {
          const val = curr.total_cal - curr.total_cal_burned;
          return (
            prev +
            (val > (curr.daily_kcal_limit || user_daily_kcal || 2000) ? 0 : 1)
          );
        } else {
          return prev;
        }
      }, 0);

      const currentDay = moment();
      const selectedMonth = moment(currentDate).month();
      const isCurrentMonth = selectedMonth === moment().month();
      const isNextMonths = moment(currentDate).isAfter(moment());

      const dayPassedFromTheStartOfMonth = isNextMonths
        ? 0
        : isCurrentMonth
        ? currentDay.diff(
            moment(currentDate).startOf('month').format('YYYY-MM-DD'),
            'days',
          ) + 1
        : moment(currentDate).daysInMonth();
      let newMissed = dayPassedFromTheStartOfMonth - newTrackedDays;
      newMissed = newMissed > 0 ? newMissed : 0;

      //change marking
      const newMarkDates: {[value: string]: any} = {};
      dates.forEach(item => {
        const value = item.total_cal - item.total_cal_burned;
        newMarkDates[item.date] = {
          customStyles: {
            container: {
              backgroundColor: getFillColor(
                value,
                item.daily_kcal_limit || user_daily_kcal || 2000,
              ),
              borderRadius: 0,
            },
          },
        };
      });

      setMissed(newMissed);
      setGreenDays(newGreenDays);
      setTrackedDays(newTrackedDays);
      setMarkedDates(newMarkDates);
    }
  }, [allDates, getFillColor, user_daily_kcal, currentDate]);

  return (
    <>
      <View style={styles.root}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Calendar
          initialDate={props.initialDisplayDate}
          onMonthChange={month => {
            setCurrentDate(month.dateString);
          }}
          monthFormat={'yyyy MM'}
          hideExtraDays={true}
          enableSwipeMonths={true}
          markingType={'custom'}
          markedDates={markedDates}
          dayComponent={({date, marking}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (date?.dateString) {
                    dispatch(changeSelectedDay(date?.dateString));
                    props.navigation.navigate(Routes.Dashboard);
                  }
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    backgroundColor: marking
                      ? marking.customStyles?.container?.backgroundColor
                      : colorsArray[0],
                    width: 32,
                    height: 32,
                    lineHeight: 32,
                  }}>
                  {date?.day}
                </Text>
              </TouchableOpacity>
            );
          }}
          renderArrow={direction => {
            return direction === 'left' ? (
              <FontAwesome name="chevron-left" style={styles.iconStyle} />
            ) : (
              <FontAwesome name="chevron-right" style={styles.iconStyle} />
            );
          }}
          renderHeader={() => {
            return (
              <Text style={styles.text}>
                {moment(currentDate).format('MMMM, YYYY')}
              </Text>
            );
          }}
        />
        <View style={styles.colorMarkers}>
          {colorsArray.slice(1, 7).map(item => (
            <View
              key={item}
              style={{backgroundColor: item, width: 10, height: 10, margin: 2}}
            />
          ))}
        </View>
        {(!!missed || !!trackedDays) && (
          <View style={styles.footer}>
            {!showMissedDays && (
              <View style={styles.footerItem}>
                <Text style={styles.footerCenteredText}>
                  Total Days Tracked
                </Text>
                <Text style={[styles.textAlignCenter, styles.bold]}>
                  {trackedDays} Days
                </Text>
              </View>
            )}
            {showMissedDays && (
              <View style={[styles.footerItem, styles.borderRight]}>
                <Text style={[styles.footerCenteredText, styles.fz12]}>
                  Days Missed
                </Text>
                <Text style={[styles.textAlignCenter, styles.bold]}>
                  {missed} Days
                </Text>
              </View>
            )}
            <View style={styles.footerItem}>
              <Text style={[styles.footerCenteredText, styles.fz12]}>
                % Days of Green
              </Text>
              <Text style={[styles.textAlignCenter, styles.bold]}>
                {trackedDays && greenDays
                  ? Math.round((greenDays / trackedDays) * 100)
                  : 0}
                %
              </Text>
            </View>
          </View>
        )}
      </View>
      <Text style={styles.footerNote}>
        Tap on any date on the calendar to review or add foods.
      </Text>
    </>
  );
};

export default NixDietGraph;
