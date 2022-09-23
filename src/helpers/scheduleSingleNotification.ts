import moment from 'moment-timezone';
import PushNotification from 'react-native-push-notification';

export default (dayindex: number) => {
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
