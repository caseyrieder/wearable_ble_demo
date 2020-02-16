import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeAppEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {stringToBytes} from 'convert-string';
import {
  intToHex,
  fullRGBConvert,
  hexToBytes,
  intToBytes,
  intToChar,
  asciiToHex,
  isHex,
  stringToHex,
} from './dataConversion';

// MAYBE!!!
import { writeCharacteristic } from './BLEWrite'

const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const UUIDPrefix = '23511812-719';
const UUIDSuffix = '-ba07-abc4-b20a119cd05b';
const serviceUUID = '23511812-7192-ba07-abc4-b20a119cd05b';
const pinUUID = '23511812-7193-ba07-abc4-b20a119cd05b';
const messageUUID = '23511812-7195-ba07-abc4-b20a119cd05b';
const colorUUID = '23511812-7196-ba07-abc4-b20a119cd05b';
const speedUUID = '23511812-7197-ba07-abc4-b20a119cd05b';
const directionUUID = '23511812-7198-ba07-abc4-b20a119cd05b';
const brightnessUUID = '23511812-7199-ba07-abc4-b20a119cd05b';
const pin = '1003-123456'

const newMessage = 'jo';
let heart = '\x01';
let heartBytes = stringToHex(heart);
// let heart = '\u{0001}';
// const emojiMessage = `${newMessage}${heart}`;
const emojiMessage = `${newMessage}${heart}${newMessage}`;
// const hexmoji = stringToHex(emojiMessage);
const hexmoji = stringToHex(`${newMessage}${heart}${newMessage}`);
const newColor = 'A12E64';
const newRGB = [161, 46, 100];
const newSpeed = 18;
const newDirection = 1;
const newBrightness = 0;

// const midColor = "0x"+newColor;
const midMessage = asciiToHex(newMessage);
const midEmojiMessage = asciiToHex(emojiMessage);
const midColor = newColor;
const hexSpeed = intToHex(newSpeed);
const midSpeed = "0x"+hexSpeed;
const midDir = "0x0"+newDirection.toString(10);

const messageToSendSTG = stringToBytes(hexmoji);
const messageToSendHEX = hexToBytes(hexmoji);
const emojiMessageToSendSTG = stringToBytes(midEmojiMessage);
const emojiMessageToSendHEX = hexToBytes(midEmojiMessage);
const pinToSend = stringToBytes(pin);
const colorToSend = stringToBytes(midColor);
// const colorToSend = intToBytes(newColor);
// const speedToSend = stringToBytes(midSpeed);
const speedToSend = intToBytes([newSpeed]);
// const dirToSend = stringToBytes(midDir);
const dirToSend = intToBytes(newDirection);

class BLEMang extends Component {
  constructor() {
    super();

    this.state = {
      scanning: false,
      peripherals: new Map(),
      paired: {},
      appState: '',
    };

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(
      this,
    );
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(
      this,
    );
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    BleManager.start({
      showAlert: false,
    });

    this.handlerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      this.handleDiscoverPeripheral,
    );
    this.handlerStop = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      this.handleStopScan,
    );
    this.handlerDisconnect = bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      this.handleDisconnectedPeripheral,
    );
    this.handlerUpdate = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      this.handleUpdateValueForCharacteristic,
    );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ).then(res => {
            if (res) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }
    console.log(`new msg text: ${newMessage} ... ${typeof newMessage}\n`);
    console.log(`emoji msg text: ${emojiMessage} ... ${typeof emojiMessage}\n`);
    console.log(`hexmoji: ${hexmoji} ... ${typeof hexmoji}\n`);
    console.log(`heartbytes: ${heartBytes}`);
    console.log(`heartbytes hex?: ${isHex(heartBytes)}`);
    console.log(`new message is hex?...${isHex(newMessage)}`);
    console.log(`emoji msg is hex?...${isHex(emojiMessage)}`);
    // console.log(`new color: ${newColor} ... ${typeof newColor}\n`);
    // console.log(`new speed: ${newSpeed} ... ${typeof newSpeed}\n`);
    // console.log(`new direction: ${newDirection} ... ${typeof newDirection}\n\n`);

    console.log('HEX\n');
    console.log(`hex nomoji: ${midMessage}`);
    console.log(`hex emoji: ${midEmojiMessage}`);
    console.log(`hex nomoji is hex?...${isHex(midMessage)}`)
    console.log(`hex emoji is hex?...${isHex(midEmojiMessage)}`)
    // console.log(`hex color: ${midColor}\n`);
    // console.log(`hex speed: ${midSpeed}\n`);
    // console.log(`hex direction: ${midDir}\n\n`);

    // console.log('BYTES\n');
    // console.log(`hex msg: ${messageToSendHEX}\n`);
    // console.log(`hex emoji: ${emojiMessageToSendHEX}\n`);
    // console.log(`stg msg: ${messageToSendSTG}\n`);
    // console.log(`stg emoji: ${emojiMessageToSendSTG}\n`);
    // console.log(`byte color: ${colorToSend}\n`);
    // console.log(`byte speed: ${speedToSend}\n`);
    // console.log(`byte dir: ${dirToSend}\n\n`);
  }
  handleAppStateChange(nextAppState) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      BleManager.getConnectedPeripherals([]).then(peripheralsArray => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({
      appState: nextAppState,
    });
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({
        peripherals,
        paired: {},
      });
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  }

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({
      scanning: false,
    });
  }

  startScan() {
    if (!this.state.scanning) {
      //this.setState({peripherals: new Map()});
      BleManager.scan([], 3, true).then(results => {
        console.log('Scanning...');
        this.setState({
          scanning: true,
        });
      });
    }
  }

  retrieveDiscovered() {
    BleManager.getDiscoveredPeripherals([]).then(discovered => {
      if (discovered.length == 0) {
        console.log('No discovered peripherals');
      }
      console.log('discovered', discovered);
      var peripherals = this.state.peripherals;
      for (var i = 0; i < discovered.length; i++) {
        var peripheral = discovered[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        this.setState({
          peripherals,
        });
      }
    });
  }

  retrieveConnected() {
    BleManager.getConnectedPeripherals([]).then(results => {
      if (results.length == 0) {
        console.log('No connected peripherals');
      }
      console.log(results);
      var peripherals = this.state.peripherals;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        this.setState({
          peripherals,
        });
      }
    });
  }

  handleDiscoverPeripheral(peripheral) {
    var peripherals = this.state.peripherals;
    console.log('Got ble peripherals, total:');
    var jsonifiedMap = JSON.stringify(Array.from(peripherals));
    console.log(jsonifiedMap);
    if (peripheral.name) {
      console.log('Named: ', peripheral);
    }
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }

    peripherals.set(peripheral.id, peripheral);
    this.setState({
      peripherals,
    });
  }

  test(peripheral) {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.retrieveServices(peripheral.id).then(peripheralInfo => {
          console.log('retrieved services');
          console.log(peripheralInfo.characteristics);
        });
      } else {
        BleManager.connect(peripheral.id).then(() => {
          let peripherals = this.state.peripherals;
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            this.setState({
              peripherals,
              paired: peripherals[0],
            });
          }
          console.log('Connected to ' + peripheral.id);

          setTimeout(() => {
            BleManager.retrieveServices(peripheral.id).then(peripheralInfo => {
              console.log('retrieved services');
              console.log(peripheralInfo.characteristics);

              // writeCharacteristic(peripheral.id, 'message', newMessage);
              // writeCharacteristic(peripheral.id, 'color', newColor);
              // writeCharacteristic(peripheral.id, 'speed', newSpeed);
              // writeCharacteristic(peripheral.id, 'direction', newDirection);
              // writeCharacteristic(peripheral.id, 'brightness', newBrightness);
              
              setTimeout(() => {
                // const byteString = stringToBytes(newMessage);

                BleManager.write(peripheral.id, serviceUUID, pinUUID, pinToSend).then(() => {
                  console.log(`Wrote pin: '${String.fromCharCode.apply(null, pinToSend)}'\n`);
                  BleManager.write(peripheral.id, serviceUUID, messageUUID, emojiMessageToSendHEX).then(() => {
                    // console.log(`emo hex: '${String.fromCharCode.apply(null, emojiMessageToSendHEX)}'\n`);
                    console.log(`textMessage: ${emojiMessage}\n`);
                    console.log(`hexMessage: ${midEmojiMessage}\n`);
                    // console.log(`hexMoji: ${hexmoji}\n`);
                    // console.log(`emojiMessageToSendHEX: ${emojiMessageToSendHEX}\n`);
                    // console.log(`string from hex: ${String.fromCharCode.apply(null, emojiMessageToSendHEX)}\n`);
                    
                    BleManager.write(peripheral.id, serviceUUID, messageUUID, emojiMessageToSendSTG).then(() => {
                      // console.log(`Nonmoji message: '${String.fromCharCode.apply(null, messageToSendHEX)}'\n`);
                      // console.log(`emo stg: ${String.fromCharCode.apply(null, emojiMessageToSendSTG)}\n`);
                      
                      
                      // BleManager.write(peripheral.id, serviceUUID, messageUUID, messageToSendHEX).then(() => {
                      //   console.log(`txt hex: [${messageToSendHEX}]\n`);
                      //   BleManager.write(peripheral.id, serviceUUID, messageUUID, messageToSendSTG).then(() => {
                      //     console.log(`txt stg: [${messageToSendSTG}]\n`);
                              BleManager.write(peripheral.id, serviceUUID, colorUUID, newRGB).then(() => {
                                console.log(`color: '${newRGB}`);
                                console.log('colortype: '+typeof newRGB+'\n');
                        BleManager.write(peripheral.id, serviceUUID, speedUUID, [newSpeed]).then(() => {
                          console.log(`speed: '${newSpeed}`);
                          console.log('speedtype: '+typeof newSpeed+'\n');

                        BleManager.write(peripheral.id, serviceUUID, directionUUID, [newDirection]).then(() => {
                          console.log(`direction: '${newDirection}`);
                          console.log('directiontype: '+typeof newDirection+'\n');
                          
                          BleManager.write(peripheral.id, serviceUUID, brightnessUUID, [newBrightness]).then(() => {
                            console.log(`brightness: '${newBrightness}`);
                            console.log('brightnesstype: '+typeof newBrightness+'\n');
                          });
                        });
                      });
                          });
                    });
                      });
                  // });
                  //   });
                });
              }, 2500);
            });
          });
        }, 2500);
      }
    }
  }
  // }

  renderItem(item) {
    if (!item.name.includes('type your reply') && !item.name.includes('Type your reply')) {
      return <View />
    } else {
      const color = item.connected ? 'green' : '#fff';
      return (
        <TouchableHighlight onPress={() => this.test(item)}>
          <View
            style={[
              styles.row,
              {
                backgroundColor: color,
              },
            ]}>
            <Text
              style={{
                fontSize: 12,
                textAlign: 'center',
                color: '#333333',
                padding: 10,
              }}>
              
              {item.name}
            </Text>
            <Text
              style={{
                fontSize: 10,
                textAlign: 'center',
                color: '#333333',
                padding: 2,
              }}>
              RSSI: {item.rssi}
            </Text>
            <Text
              style={{
                fontSize: 8,
                textAlign: 'center',
                color: '#333333',
                padding: 2,
                paddingBottom: 20,
              }}>
              
              {item.id}
            </Text>
            <Text
              style={{
                fontSize: 6,
                textAlign: 'center',
                color: '#aaaaaa',
                padding: 2,
                paddingBottom: 5,
              }}>
              
              {JSON.stringify(item)}
            </Text>
          </View>
        </TouchableHighlight>
      );
    }
  };

  render() {
    const list = Array.from(this.state.peripherals.values());

    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={{
            marginTop: 40,
            margin: 20,
            padding: 20,
            backgroundColor: '#ccc',
          }}
          onPress={() => this.startScan()}>
          <Text> Scan Bluetooth({this.state.scanning ? 'on' : 'off'}) </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={{
            marginTop: 0,
            margin: 20,
            padding: 20,
            backgroundColor: '#ccc',
          }}
          onPress={() => this.retrieveDiscovered()}>
          <Text> Retrieve discovered peripherals </Text>
        </TouchableHighlight>
        <ScrollView style={styles.scroll}>
          
          {this.state.paired && (
            <View
              style={{
                flex: 1,
                margin: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                sendAs HexHEX: {emojiMessageToSendHEX}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                sendAs STG: {emojiMessageToSendSTG}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                $ {JSON.stringify(this.state.paired)}
              </Text>
            </View>
          )}
          {list.length == 0 && (
            <View
              style={{
                flex: 1,
                margin: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                No peripherals
              </Text>
            </View>
          )}
          <FlatList
            data={list}
            renderItem={({item}) => this.renderItem(item)}
            keyExtractor={item => item.id}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10,
  },
});

export default BLEMang;
