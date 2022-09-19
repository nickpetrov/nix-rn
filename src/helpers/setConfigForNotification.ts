import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';

export default () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token: {os: string; token: string}) {
      console.log('TOKEN:', token);
    },
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: false,
      sound: false,
    },
  });

  PushNotification.createChannel(
    {
      channelId: 'reminders', // (required)
      channelName: 'Task reminder notifications', // (required)
      channelDescription: 'Reminder for any tasks',
    },
    () => {},
  );
};
