import analytics from '@react-native-firebase/analytics';

export const analyticSetUserId = (userId: string) => {
  // $cordovaGoogleAnalytics.setUserId(userId);
  analytics().setUserId(userId);
};

export const analyticTrackEvent = (name: string, data: any) => {
  // $cordovaGoogleAnalytics.trackEvent(name, data, 'Label', 1);
  analytics().logEvent(name, {info: data});
};
