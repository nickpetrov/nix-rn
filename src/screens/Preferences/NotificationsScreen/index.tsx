// utils
import React, {useEffect, useState, useCallback} from 'react';

// components
import {View, Text, Switch, Platform, SafeAreaView, PermissionsAndroid} from 'react-native';

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
import {Colors} from 'constants/Colors';

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
    } else if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION).then(permission => {
        if(permission) {
          scheduleNotification(weekDay, weekEnd);
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION)
        }
      })
    }
  }, []);

  useEffect(() => {
    dispatch(
      userActions.updateUserData({
        weekday_reminders_enabled: weekday ? 1 : 0,
        weekend_reminders_enabled: weekend ? 1 : 0,
      }),
    )
      .then(() => {
        changeHandler(weekday ? 1 : 0, weekend ? 1 : 0);
      })
      .catch(err => {
        console.log(err);
      });
  }, [weekend, weekday, changeHandler, dispatch]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.item}>
        <View style={styles.left}>
          <Text style={styles.title}>Weekday Push Notifications</Text>
          <Text>
            If enabled, we send a push alert at 9PM on any weekday (Mon-Fri)
            when you forget to log your foods.
          </Text>
        </View>
        <View>
          <Switch
            value={weekday}
            onChange={() => setWeekday(previousState => !previousState)}
            style={styles.switch}
            trackColor={{false: Colors.LightGray, true: Colors.LightGreen}}
            thumbColor={'#fff'}
            ios_backgroundColor="#fff"
          />
        </View>
      </View>
      <View style={styles.item}>
        <View style={styles.left}>
          <Text style={styles.title}>Weekend Push Notifications</Text>
          <Text>
            If enabled, we send a push alert at 9PM on any weekend (Sat-Sun)
            when you forget to log your foods.
          </Text>
        </View>
        <View>
          <Switch
            value={weekend}
            onChange={() => setWeekend(previousState => !previousState)}
            style={styles.switch}
            trackColor={{false: Colors.LightGray, true: Colors.LightGreen}}
            thumbColor={'#fff'}
            ios_backgroundColor="#fff"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
