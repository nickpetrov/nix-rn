import moment from 'moment-timezone';
import React, {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';

interface useLocalNotificationProps {
  weekday: number;
  weekend: number;
}

const useLocalNotification: React.FC<useLocalNotificationProps> = ({
  weekday,
  weekend,
}) => {
  const scheduleSingleNotification = (dayindex: number) => {
    let scheduleDate = moment(
      '21:00 ' + moment().isoWeekday(dayindex).format('DD/MM/YYYY'),
      'HH:mm DD/MM/YYYY',
    );
    let triggerDate;

    if (moment().isoWeekday() < dayindex) {
      triggerDate = new Date(scheduleDate.format());
    } else {
      triggerDate = new Date(scheduleDate.add(1, 'weeks').format());
    }

    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title: 'Nutritionix Track',
      message:
        'Your food log looks a bit empty. Tap here to log what you ate today.',
      date: triggerDate,
    });
  };
  useEffect(() => {
    PushNotification.cancelAllLocalNotifications();

    for (let i = 1; i < 8; i++) {
      if (!!weekday && i < 6) {
        scheduleSingleNotification(i);
      }
      if (!!weekend && i > 5) {
        scheduleSingleNotification(i);
      }
    }
  }, [weekday, weekend]);
  return null;
};

export default useLocalNotification;
