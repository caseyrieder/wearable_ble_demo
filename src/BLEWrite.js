import React from 'react';
import {
    NativeAppEventEmitter,
    NativeEventEmitter,
    NativeModules
  } from 'react-native';
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

import { stringToBytes } from 'convert-string';
import { intToHex } from './dataConversion';

const serviceUUID = '23511812-7192-ba07-abc4-b20a119cd05b';
const pinUUID = '23511812-7193-ba07-abc4-b20a119cd05b';

export function writeCharacteristic(peripheralID, charName, rawData) {
    setTimeout(() => {
        let charID = '';
        let data;
        if (charName = 'message') {
            let data = stringToBytes(rawData);
            let charID = '23511812-7195-ba07-abc4-b20a119cd05b';
        } else if (charName = 'color') {
            let midData = "0x"+rawData;
            let data = stringToBytes(midData);
            let charID = '23511812-7196-ba07-abc4-b20a119cd05b';
        } else if (charName = 'speed') {
            let hexData = intToHex(rawData);
            let midData = "0x"+hexData;
            let data = stringToBytes(midData);
            let charID = '23511812-7197-ba07-abc4-b20a119cd05b';
        } else if (charName = 'direction') {
            let midData = "0x0"+rawData.toString(10);
            let data = stringToBytes(midData);
            let charID = '23511812-7198-ba07-abc4-b20a119cd05b';
        } else if (charName = 'brightness') {
            let data = stringToBytes(rawData);
            let charID = '23511812-7199-ba07-abc4-b20a119cd05b';
        } else if (charNmae = 'pin') {
            let hexedData = asciiToHex(rawData);
            let midData = '0x' + hexedData;
            let data = stringToBytes(midData);
            let charID = '23511812-7193-ba07-abc4-b20a119cd05b';
        }

        BleManager.write(
            peripheralID,
            serviceUUID,
            charID,
            data
          ).then(() => {
            console.log(`Wrote ${charName}: ${String.fromCharCode.apply(null, data)}'\n`);
          });
    }, 1500);
};