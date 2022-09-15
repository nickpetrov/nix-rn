import moment from 'moment';

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
  console.log(triggerDate);
  // Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: 'Nutritionix Track',
  //     body: 'Your food log looks a bit empty. Tap here to log what you ate today.',
  //   },
  //   trigger: triggerDate,
  // });
};

export const scheduleNotifications = (weekday: number, weekend: number) => {
  //TODO - check if food log in each day have any foods logged
  // need to cancel all notifications before scheduling new.
  // Notifications.cancelAllScheduledNotificationsAsync().then(() => {
  //   for (let i = 1; i < 8; i++) {
  //     if (!!weekday && i < 6) {
  //       scheduleSingleNotification(i);
  //     }
  //     if (!!weekend && i > 5) {
  //       scheduleSingleNotification(i);
  //     }
  //   }
  // });
  console.log(weekday, weekend);
  console.log(scheduleSingleNotification(1));
};
