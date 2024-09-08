import { View, TouchableOpacity, ViewStyle } from 'react-native';
import React, { useEffect } from 'react';
import { customMapStyle } from '~/lib/customMapStyle';
import MapView, { Marker } from 'react-native-maps';
import { router } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDistanceFromLatLonInMeters } from '~/utils/getDistanceBetweenLocations';
import { useLocation } from '~/hooks/useLocation';
import { Text } from './nativewindui/Text';
import { Image } from 'expo-image';
import { useAuth } from '~/providers/AuthContext';
import { COORDS } from '~/constants';
import { useColorScheme } from '~/lib/useColorScheme';

type Props = {
   shouldGoBack: boolean;
   containerStyle?: ViewStyle;
};

const MapHeader = ({ shouldGoBack, containerStyle }: Props) => {
   const mapRef = React.useRef<MapView>(null);
   const { isDarkColorScheme } = useColorScheme();
   const { user } = useAuth();
   const { top } = useSafeAreaInsets();
   const { location } = useLocation();

   useEffect(() => {
      mapRef.current?.animateToRegion({
         ...COORDS,
         latitudeDelta: 0.002, // Smaller value for closer zoom
         longitudeDelta: 0.002,
      });
      mapRef.current?.animateCamera({
         center: COORDS,
         pitch: 70,
         heading: 90,
         altitude: 140,
      });
   }, [mapRef]);

   return (
      <View style={[{ flex: 0.5 }, containerStyle]}>
         {location && (
            <MapView
               ref={mapRef}
               customMapStyle={customMapStyle}
               // initialCamera={{
               //    heading: 60,
               //    pitch: 50,
               //    altitude: 100,
               //    center: COORDS,
               // }}
               style={{ flex: 1 }}
               region={{
                  ...COORDS,
                  latitudeDelta: 0.002, // Smaller value for closer zoom
                  longitudeDelta: 0.002,
               }}
               initialRegion={{
                  ...COORDS,
                  latitudeDelta: 0.002, // Smaller value for closer zoom
                  longitudeDelta: 0.002,
               }}>
               <Marker
                  coordinate={COORDS}
                  identifier="barber"
                  description="1420 Clay Ave"
                  title="Moya Barber-Shop"
               />
            </MapView>
         )}
         <View
            style={{
               top: top - 10,
               position: 'absolute',

               zIndex: 20,
               padding: 4,
               left: 0,
               right: 0,
               width: '100%',
               flexDirection: 'row',
               alignItems: 'center',
               paddingHorizontal: 16,
               justifyContent: 'space-between',
            }}>
            {shouldGoBack ? (
               <TouchableOpacity className="rounded-full p-2" onPress={router.back}>
                  <FontAwesome
                     name="chevron-left"
                     size={26}
                     color={isDarkColorScheme ? 'white' : 'black'}
                  />
               </TouchableOpacity>
            ) : (
               <Image
                  style={{
                     width: 60,
                     height: 60,
                     borderRadius: 30,
                     objectFit: 'cover',
                     backgroundColor: 'white',
                  }}
                  source={user?.image ? { uri: user.image } : require('~/assets/images/banner.png')}
               />
            )}
            <Text className="font-raleway-bold text-2xl">Hi, {user?.name?.split(' ')[0]}</Text>
            <TouchableOpacity
               onPress={() => {
                  mapRef.current?.animateCamera({
                     center: COORDS,
                     pitch: 60,
                     heading: 90,
                     altitude: 100,
                  });
               }}>
               <MaterialIcons
                  name="location-searching"
                  size={28}
                  color={isDarkColorScheme ? 'white' : 'black'}
               />
            </TouchableOpacity>
         </View>
      </View>
   );
};

export default MapHeader;
