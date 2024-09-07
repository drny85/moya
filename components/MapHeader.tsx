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

const COORDS = {
   latitude: 40.83728,
   longitude: -73.90757,
};

type Props = {
   shouldGoBack: boolean;
   containerStyle?: ViewStyle;
};

const MapHeader = ({ shouldGoBack, containerStyle }: Props) => {
   const mapRef = React.useRef<MapView>(null);
   const { top } = useSafeAreaInsets();
   const { loading, location } = useLocation();
   const distance =
      location &&
      !loading &&
      getDistanceFromLatLonInMeters(COORDS, {
         latitude: location?.coords.latitude,
         longitude: location?.coords.longitude,
      });
   console.log(location);
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
               top,
               position: 'absolute',
               zIndex: 20,
               padding: 4,
               left: 8,
               width: '98%',
               flexDirection: 'row',
               justifyContent: 'space-between',
            }}>
            {shouldGoBack ? (
               <TouchableOpacity className="rounded-full p-2" onPress={router.back}>
                  <FontAwesome name="chevron-left" size={26} color="#212121" />
               </TouchableOpacity>
            ) : (
               <View />
            )}
            {distance && (
               <View className="rounded-full bg-card px-2 py-1">
                  <Text className="text-lg font-semibold text-muted">
                     {distance.toFixed(1) === '0.0'
                        ? 'You Here!'
                        : ` You are ${distance.toFixed(1)} miles away`}
                  </Text>
               </View>
            )}
            <TouchableOpacity
               className="mr-3"
               onPress={() => {
                  mapRef.current?.animateCamera({
                     center: COORDS,
                     pitch: 60,
                     heading: 90,
                     altitude: 100,
                  });
               }}>
               <MaterialIcons name="location-searching" size={28} color="#212121" />
            </TouchableOpacity>
         </View>
      </View>
   );
};

export default MapHeader;
