import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import AppointmentCard from '~/components/Appointment/AppointmentCard';
import BarberCard from '~/components/BarberCard';
import { Button } from '~/components/Button';
import MapHeader from '~/components/MapHeader';
import { isPast } from 'date-fns';
import { Text } from '~/components/nativewindui/Text';
import ParallaxScrollView from '~/components/ParallaxScrollView';

import { useAuth } from '~/providers/AuthContext';
import { useAppointmentStore } from '~/providers/useAppointmentStore';
import { COLORS } from '~/theme/colors';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '~/hooks/useLocation';
import { getDistanceFromLatLonInMeters } from '~/utils/getDistanceBetweenLocations';
import { COORDS } from '~/constants';

const Home = () => {
   const { user } = useAuth();
   const { location, loading } = useLocation();
   const distance =
      location &&
      !loading &&
      getDistanceFromLatLonInMeters(COORDS, {
         latitude: location?.coords.latitude,
         longitude: location?.coords.longitude,
      });

   const apppoitments = useAppointmentStore((state) =>
      state.appointments.filter((a) => a.customer.id === user?.id)
   );
   const appointment = apppoitments
      .filter(
         (app) => app.status !== 'completed' && app.status !== 'cancelled' && !isPast(app.date)
      )
      .sort((a, b) => (a.date > b.date ? 1 : -1));

   return (
      <View className="flex-1">
         <ParallaxScrollView
            headerBackgroundColor={{ light: COLORS.light.background, dark: COLORS.dark.background }}
            headerImage={
               <>
                  <MapHeader shouldGoBack={false} containerStyle={{ flex: 1 }} />
                  <BlurView
                     tint="light"
                     className="absolute bottom-0 left-0 right-0 z-10 gap-1 overflow-hidden rounded-md  px-2 py-1"
                     intensity={40}>
                     <View>
                        <View className="flex-row items-center justify-between">
                           <Text variant={'title3'}>Moya Barber Shop</Text>
                           {distance && <Text>{distance.toFixed(1)} miles</Text>}
                        </View>
                        <Text className=" text-sm text-slate-500 dark:text-white">
                           1420 Clay Ave
                        </Text>
                        <Text className="text-sm text-slate-500 dark:text-white">
                           Bronx, NY 10456
                        </Text>
                     </View>
                  </BlurView>
               </>
            }>
            <View className=" gap-2 rounded-lg bg-card p-2 shadow-sm">
               <Text variant={'title2'}>My Upcoming Appointment</Text>
               {appointment.length > 0 ? (
                  <AppointmentCard
                     appointmentId={appointment[0].id!}
                     onPress={(apt) => {
                        router.push({
                           pathname: '/appointment',
                           params: { appointmentId: apt.id },
                        });
                     }}
                  />
               ) : (
                  <View className="gap-3">
                     <Text className="font-medium text-muted">No Upcoming Appointment</Text>
                     <View className="w-1/2 self-center">
                        <Button title="Book Now" onPress={() => router.push('/barbers')} />
                     </View>
                  </View>
               )}
            </View>
            <View className="gap-2 rounded-l bg-card p-2 shadow-sm">
               <Text variant={'title2'}>My Barber</Text>
               {!user?.isBarber && user?.favoriteBarber ? (
                  <BarberCard barber={user.favoriteBarber} index={0} isOwner={false} />
               ) : (
                  <View className="gap-3">
                     <Text className="font-medium text-muted">No Barber Available</Text>
                     <View className="w-1/2 self-center">
                        <Button title="Find Barber" onPress={() => router.push('/barbers')} />
                     </View>
                  </View>
               )}
            </View>
         </ParallaxScrollView>
      </View>
   );
};

export default Home;
