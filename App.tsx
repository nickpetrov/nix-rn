import React from 'react';
import {SafeAreaView} from 'react-native';
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
