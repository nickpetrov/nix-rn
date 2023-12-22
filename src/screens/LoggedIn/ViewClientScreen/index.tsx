// utils
import React, {useState, useEffect} from 'react';
import moment from 'moment-timezone';

// components
import {
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Linking,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FoodLogStats from 'components/FoodLog/FoodLogHeader/FoodLogStats/index';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {
  getClientTotals,
  getClientFoodLog,
  clearClientTotalsAndFoods,
  changeClientSelectedDay,
} from 'store/coach/coach.actions';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {FoodProps} from 'store/userLog/userLog.types';

// styles
import {styles} from './ViewClientScreen.styles';
import {TouchableOpacity} from 'react-native';

interface ViewClientScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.ViewClient
  >;
  route: RouteProp<StackNavigatorParamList, Routes.ViewClient>;
}

const ViewClientScreen: React.FC<ViewClientScreenProps> = ({
  route,
  navigation,
}) => {
  const {client, clientId} = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {clientTotals: totals, clientFoods} = useSelector(state => state.coach);
  const [age] = useState(
    moment().diff(moment(client.birth_year, 'YYYY'), 'years') || '',
  );
  const [showPreloader, setShowPreloader] = useState(false);
  const currentMonth = moment().startOf('month').format('YYYY-MM-DD');
  const [months, setMonths] = useState({
    currentMonth,
    nextMonth: moment(currentMonth).add(1, 'month').format('YYYY-MM-DD'),
    prevMonth: moment(currentMonth).subtract(1, 'month').format('YYYY-MM-DD'),
  });

  useEffect(() => {
    if (isFocused) {
      setShowPreloader(true);
      const options = {
        clientId: client.id || clientId,
        timezone: client.timezone,
        begin: moment(months.currentMonth, 'YYYY-MM-DD')
          .startOf('month')
          .format('YYYY-MM-DD'),
        end: moment(months.currentMonth, 'YYYY-MM-DD')
          .endOf('month')
          .add(1, 'day')
          .format('YYYY-MM-DD'),
      };
      dispatch(getClientTotals(options))
        .then(() => {
          dispatch(getClientFoodLog(options))
            .then(() => {
              setShowPreloader(false);
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
          setShowPreloader(false);
        });
    }

    return () => {
      dispatch(clearClientTotalsAndFoods());
    };
  }, [clientId, client, months.currentMonth, dispatch, isFocused]);

  const changeMonth = (count: number) => {
    if (!count) return;

    const newCurrentMonth = moment(months.currentMonth, 'YYYY-MM-DD')
      .add(count, 'month')
      .startOf('month')
      .format('YYYY-MM-DD');
    const newNextMonth = moment(newCurrentMonth)
      .add(1, 'month')
      .format('YYYY-MM-DD');
    const newPrevMonth = moment(newCurrentMonth)
      .subtract(1, 'month')
      .format('YYYY-MM-DD');
    dispatch(clearClientTotalsAndFoods()).then(() => {
      setMonths({
        currentMonth: newCurrentMonth,
        nextMonth: newNextMonth,
        prevMonth: newPrevMonth,
      });
    });
  };

  const emailToClient = () => {
    Linking.openURL(`mailto:${client.email}`);
  };

  return (
    <SafeAreaView style={styles.root}>
    <ScrollView style={styles.root}>
      {client && (
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>
              {client.last_name ? `${client.last_name}, ` : ''}
              {client.first_name}
              {'  '}
              {age ? `${age}, ` : ''}
              {client.gender === 'male' ? 'M' : 'F'}
            </Text>
            <Text>
              Days tracked in {moment(months.currentMonth).format('MMMM')}:{' '}
              {totals.length}
            </Text>
          </View>
          {client.email && (
            <TouchableWithoutFeedback onPress={emailToClient}>
              <View style={styles.mail}>
                <FontAwesome name="envelope-o" color="#444" size={18} />
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      )}
      <View style={styles.months}>
        <TouchableWithoutFeedback onPress={() => changeMonth(-1)}>
          <Text style={styles.monthText}>
            {moment(months.prevMonth).format('MMM')}
          </Text>
        </TouchableWithoutFeedback>
        <View style={styles.activeMonth}>
          <FontAwesome name="angle-left" color="#888" size={20} />
          <Text style={styles.activeMonthText}>
            {moment(months.currentMonth).format('MMMM')}
          </Text>
          <FontAwesome name="angle-right" color="#888" size={20} />
        </View>
        <TouchableWithoutFeedback onPress={() => changeMonth(1)}>
          <Text style={styles.monthText}>
            {moment(months.nextMonth).format('MMM')}
          </Text>
        </TouchableWithoutFeedback>
      </View>
      {showPreloader && <Text style={styles.empty}>Loading</Text>}
      {!showPreloader && !totals.length && (
        <Text style={styles.empty}>No logged data this month.</Text>
      )}
      {!showPreloader &&
        totals.map(item => {
          const foods = clientFoods.filter(
            (el: FoodProps) =>
              moment
                .utc(el.consumed_at)
                .tz(client.timezone)
                .format('YYYY-MM-DD') ===
              moment(item.date).format('YYYY-MM-DD'),
          );
          return (
            <TouchableOpacity
              key={item.date}
              style={styles.totalItem}
              onPress={() => {
                const newDate = moment(item.date).format('YYYY-MM-DD');
                dispatch(changeClientSelectedDay(newDate));
                navigation.navigate(Routes.ViewClientDayLog, {
                  client,
                });
              }}>
              <View>
                <Text style={styles.totalItemTitle}>
                  {moment(item.date).format('dddd, MMMM Do YYYY')}
                </Text>
                <View style={styles.stats}>
                  <FoodLogStats
                    foods={foods}
                    caloriesLimit={item.daily_kcal_limit}
                    caloriesBurned={item.total_cal_burned}
                    withoutNavigate
                    withArrow
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
    </ScrollView>
    </SafeAreaView>
  );
};

export default ViewClientScreen;
