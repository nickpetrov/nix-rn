/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import setConfigForNotification from 'helpers/setConfigForNotification';
import {name as appName} from './app.json';

setConfigForNotification();

AppRegistry.registerComponent(appName, () => App);
