// utils
import React, {useEffect, useState, useCallback} from 'react';

// components
import {View, Text, Switch, Platform} from 'react-native';

// helpres
import scheduleNotification from 'helpers/scheduleNotification';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import PushNotification, {
  PushNotificationPermissions,
} from 'react-native-push-notification';

// actions
import * as userActions from 'store/auth/auth.actions';

// styles
import {styles} from './NotificationsScreen.styles';

export const NotificationsScreen: React.FC = () => {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.auth.userData);
  const [weekday, setWeekday] = useState(!!userData.weekday_reminders_enabled);
  const [weekend, setWeekend] = useState(!!userData.weekend_reminders_enabled);

  const changeHandler = useCallback((weekDay: number, weekEnd: number) => {
    if (Platform.OS === 'ios') {
      PushNotification.checkPermissions(
        ({alert}: PushNotificationPermissions) => {
          if (!alert) {
            PushNotification.requestPermissions().then(
              ({alert: alertSuccess}: PushNotificationPermissions) => {
                if (alertSuccess) {
                  scheduleNotification(weekDay, weekEnd);
                }
              },
            );
          } else {
            scheduleNotification(weekDay, weekEnd);
          }
        },
      );
    } else {
      scheduleNotification(weekDay, weekEnd);
    }
  }, []);

  useEffect(() => {
    dispatch(
      userActions.updateUserData({
        weekday_reminders_enabled: weekday ? 1 : 0,
        weekend_reminders_enabled: weekend ? 1 : 0,
      }),
    ).then(() => {
      changeHandler(weekday ? 1 : 0, weekend ? 1 : 0);
    });
  }, [weekend, weekday, changeHandler, dispatch]);

  return (
    <View style={styles.root}>
      {/* <Button title="Press me" onPress={() => changeHandler()} /> */}

      <View style={styles.item}>
        <View style={styles.switchContainer}>
          <Switch
            value={weekday}
            onChange={() => setWeekday(previousState => !previousState)}
            style={styles.switch}
          />
          <Text style={styles.text}>Weekday Push Notifications</Text>
        </View>
        <Text>
          If enabled, we send a push alert at 9PM on any weekday (Mon-Fri) when
          you forget to log your foods.
        </Text>
      </View>
      <View style={styles.item}>
        <View style={styles.switchContainer}>
          <Switch
            value={weekend}
            onChange={() => setWeekend(previousState => !previousState)}
            style={styles.switch}
          />
          <Text style={styles.text}>Weekend Push Notifications</Text>
        </View>
        <Text>
          If enabled, we send a push alert at 9PM on any weekend (Sat-Sun) when
          you forget to log your foods.
        </Text>
      </View>
    </View>
  );
};
