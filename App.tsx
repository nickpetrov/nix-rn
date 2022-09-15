import React from 'react';
import {SafeAreaView, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Settings} from 'react-native-fbsdk-next';

import {Navigation} from 'navigation';

// store
import {store} from 'store';

// styles
import {styles} from './App.styles';

Settings.initializeSDK();

// ignore WARNINGS - new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
