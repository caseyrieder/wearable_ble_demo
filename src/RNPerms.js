import RNPermissions, {
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
  Permission,
  NotificationsResponse,
} from 'react-native-permissions';

export function requestLocationPermission() {
  try {
    const granted = request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(
      result => {
        console.log(result);
      },
    );
    // {
    //   title: 'Location permission for bluetooth scanning',
    //   message: 'wahtever',
    //   buttonNeutral: 'Ask Me Later',
    //   buttonNegative: 'Cancel',
    //   buttonPositive: 'OK',
    // },
    // );
    if (granted === RESULTS.GRANTED) {
      console.log('Location permission for bluetooth scanning granted');
      return true;
    } else {
      console.log('Location permission for bluetooth scanning revoked');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}
