import PushNotification from 'react-native-push-notification';
import scheduleSingleNotification from './scheduleSingleNotification';

export default (weekday: number, weekend: number) => {
  PushNotification.cancelAllLocalNotifications();

  for (let i = 1; i < 8; i++) {
    if (!!weekday && i < 6) {
      scheduleSingleNotification(i);
    }
    if (!!weekend && i > 5) {
      scheduleSingleNotification(i);
    }
  }
};
