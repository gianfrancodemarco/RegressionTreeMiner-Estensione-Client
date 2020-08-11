/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import AppRouter from './src/AppRouter';


AppRegistry.registerComponent(appName, () => AppRouter);
