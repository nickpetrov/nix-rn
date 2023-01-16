/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import setConfigForNotification from 'helpers/setConfigForNotification';
import {name as appName} from './app.json';
// need fot camera frame processor
import 'react-native-reanimated';

setConfigForNotification();

AppRegistry.registerComponent(appName, () => App);
