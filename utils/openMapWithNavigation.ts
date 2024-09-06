import { Linking } from 'react-native';

export const openMapWithNavigation = (latitude: number, longitude: number) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    })
    .catch((err) => console.error('An error occurred', err));
};
