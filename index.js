/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import BLEMang from './src/BLEMgr';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => BLEMang);
