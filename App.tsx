import React, {useEffect} from 'react';
import {SafeAreaView, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Settings} from 'react-native-fbsdk-next';
import SplashScreen from 'react-native-splash-screen';
import MainContent from 'components/MainContent';
import {PersistGate} from 'redux-persist/integration/react';
import * as Sentry from '@sentry/react-native';
import analytics from '@react-native-firebase/analytics';

//for work uuid
import 'react-native-get-random-values';

// store
import {persistor, store} from 'store';

// styles
import {styles} from './App.styles';
import LoadIndicator from 'components/LoadIndicator';

Settings.initializeSDK();

// ignore WARNINGS - new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

// from ionic
// Sentry.init({
//   dsn: 'https://84e7ad3ef0d24d73895d708080289fb3@sentry.io/1212947',
//   release: 'com.nutritionix.nixtrack-%%VERSION%%' + (__DEV__ ? '-dev' : ''),
// });

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: `https://${process.env.REACT_APP_SENTRY_KEY}.ingest.sentry.io/4504241441538048`,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      // ...
    }),
  ],
});

const App = () => {
  const navigation =
    React.useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null);
  const routeNameRef = React.useRef<string>();
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <PersistGate loading={<LoadIndicator />} persistor={persistor}>
          <SafeAreaView style={styles.container}>
            <NavigationContainer
              ref={navigation}
              onReady={() => {
                // Register the navigation container with the instrumentation
                routingInstrumentation.registerNavigationContainer(navigation);
                // for analytic
                routeNameRef.current =
                  navigation?.current?.getCurrentRoute()?.name;
              }}
              onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName =
                  navigation?.current?.getCurrentRoute()?.name;

                if (previousRouteName !== currentRouteName) {
                  await analytics().logScreenView({
                    screen_name: currentRouteName,
                    screen_class: currentRouteName,
                  });
                  Sentry.configureScope(function (scope) {
                    scope.setExtra('currentView', currentRouteName);
                  });
                }
                routeNameRef.current = currentRouteName;
              }}>
              <MainContent />
            </NavigationContainer>
          </SafeAreaView>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(App);
