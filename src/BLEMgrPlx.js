/* eslint-disable no-shadow */
// eslint-disable no-shadow
import React, {Component} from 'react';
import {Platform, View, Text, TouchableOpacity} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import requestLocationPermission from './Permissions';
// import requestLocationPermission from './RNPerms';

function reqPerm() {
  try {
    request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(result => {
      console.log(result);
      if (result === 'granted') {
        console.log('Location permission for bluetooth scanning granted');
        return true;
      } else {
        console.log('Location permission for bluetooth scanning revoked');
        return false;
      }
    });
  } catch (err) {
    console.warn(err);
    return false;
  }
}

/*
const BLEMgr = new BleManager();
const characteristic = {
  'uuid': string,
  'serviceUUID': string,
  'deviceUUID': string,
  'isReadable': boolean,
  'isWriteableWithResponse': boolean,
  'isWriteableWithoutResponse': boolean,
  'isNotifiable': boolean,
  'isNotifying': boolean,
  'isIndictable': boolean,
  'value': string,
  // Utility functions...
  const device // we got it by calling connectToDevice
  const service // we got it by calling servicesForDevice
  const characteristic // we got it by calling characteristicsForDevice

  manager.readCharacteristicForDevice(deviceUUID, serviceUUID, characteristicUUID)
  device.readCharacteristicForService(serviceUUID, characteristicUUID)
  service.readCharacteristic(characteristicUUID)
  characteristic.read()
}
*/
class SensorsComponent extends Component {
  constructor() {
    super();
    this.manager = new BleManager();
    this.state = {info: '', values: {}};
    this.prefixUUID = 'f000aa';
    this.suffixUUID = '-0451-4000-b000-000000000000';
    this.sensors = {
      0: 'Message',
      1: 'Color',
      2: 'Direction',
      3: 'Speed',
    };
  }

  serviceUUID(num) {
    return this.prefixUUID + num + '0' + this.suffixUUID;
  }

  notifyUUID(num) {
    return this.prefixUUID + num + '1' + this.suffixUUID;
  }

  writeUUID(num) {
    return this.prefixUUID + num + '2' + this.suffixUUID;
  }

  info(message) {
    this.setState({info: message});
  }

  error(message) {
    this.setState({info: 'ERROR: ' + message});
  }

  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}});
  }

  // componentWillMount() {
  //   if (Platform.OS === 'ios') {
  //     this.manager.onStateChange(state => {
  //       if (state === 'PoweredOn') {
  //         this.scanAndConnect();
  //       }
  //     });
  //   } else {
  //     this.scanAndConnect();
  //   }
  // }

  scanAndConnect() {
    const permission = reqPerm();
    if (permission) {
      this.manager.startDeviceScan(null, null, (error, device) => {
        this.info('Scanning...');
        console.log(device);

        if (error) {
          this.error(error.message);
          return;
        }

        if (device.name === 'TKBag' || device.name === 'TKBag') {
          this.info('Conecting to Telekom Smart Bag');
          this.manager.stopDeviceScan();
          device
            .connect()
            .then(device => {
              this.info('Discovering services & characteristics');
              return device.discoverAllServicesAndCharacteristics();
            })

            .then(device => {
              this.info('Setting notifications');
              return this.setupNotifications(device);
            })
            .then(
              () => {
                this.info('Listening...');
              },
              error => {
                this.error(error.message);
              },
            );
        }
      });
    }
  }

  async setupNotifications(device) {
    for (const id in this.sensors) {
      const service = this.serviceUUID(id);
      const characteristicW = this.writeUUID(id);
      const characteristicN = this.notifyUUID(id);

      const characteristic = await device.writeCharacteristicWithResponseForService(
        service,
        characteristicW,
        'AQ==' /* 0x01 in hex */,
      );

      device.monitorCharacteristicForService(
        service,
        characteristicN,
        (error, characteristic) => {
          if (error) {
            this.error(error.message);
            return;
          }
          this.updateValue(characteristic.uuid, characteristic.value);
        },
      );
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.scanAndConnect()}>
          <Text>Get Permission</Text>
        </TouchableOpacity>
        <Text>{this.state.info}</Text>
        {Object.keys(this.sensors).map(key => {
          return (
            <Text key={key}>
              {this.sensors[key] +
                ': ' +
                (this.state.values[this.notifyUUID(key)] || '-')}
            </Text>
          );
        })}
      </View>
    );
  }
}

export default SensorsComponent;
