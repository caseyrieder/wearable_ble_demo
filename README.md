# SETUP INSTRUCTIONS

- If you do not have npm installed, follow installation instructions here: https://nodejs.org/en/download/

Once you have npm installed:

1. Download or clone the repo
2. In Terminal or Console, navigate the to project folder (XXX/XXX/XXX/wearable_ble_demo/)
3. Run "npm install"
4. navigate to `// file: android/app/src/main/AndroidManifest.xml` and update the file with:

```   <uses-permission android:name="android.permission.BLUETOOTH"/> ```

```   <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/> ```

```   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" /> ```


   (should be around line 5 or so)

\*\*\* I dont recommend trying on an iOS device, since the setup for allowing even debugging is incredibly frustrating

6. Now run "npm start react-native" from the terminal/console

- Step 5 should start the Metro Bundler running. Do not close that tab in the Terminal/Console

To run the app on a device, refer to the React Native guide at https://facebook.github.io/react-native/docs/running-on-device
