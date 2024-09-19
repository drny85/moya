import { isPast } from 'date-fns';
import { BlurView } from 'expo-blur';
import { Redirect, router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import AppointmentCard from '~/components/Appointment/AppointmentCard';
import BarberCard from '~/components/BarberCard';
import { Button } from '~/components/Button';
import Loading from '~/components/Loading';
import MapHeader from '~/components/MapHeader';
import { Text } from '~/components/nativewindui/Text';
import ParallaxScrollView from '~/components/ParallaxScrollView';

import { COORDS } from '~/constants';
import { useLocation } from '~/hooks/useLocation';
import { useAuth } from '~/providers/AuthContext';
import { useAppointmentStore } from '~/providers/useAppointmentStore';
import { useBarbersStore } from '~/providers/useBarbersStore';
import { COLORS } from '~/theme/colors';
import { getDistanceFromLatLonInMeters } from '~/utils/getDistanceBetweenLocations';

const Home = () => {
   const { user } = useAuth();
   const { location, loading } = useLocation();
   const favoriteBarber =
      !user?.isBarber && user?.favoriteBarber ? user?.favoriteBarber : undefined;
   const { getBarberById } = useBarbersStore();
   const barber = getBarberById(favoriteBarber!);
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
                     <Text className="text-muted dark:text-slate-400">No Upcoming Appointment</Text>
                     <View className="w-1/2 self-center">
                        <Button title="Book Now" onPress={() => router.push('/barbers')} />
                     </View>
                  </View>
               )}
            </View>
            <View className="gap-2 rounded-l bg-card p-2 shadow-sm">
               <Text variant={'title2'}>My Barber</Text>
               {!user?.isBarber && user?.favoriteBarber && barber ? (
                  <BarberCard barber={barber} index={0} isOwner={false} />
               ) : (
                  <View className="gap-3">
                     <Text className="text-muted dark:text-slate-400">No Barber Available</Text>
                     <View className="w-1/2 self-center">
                        <Button title="Find Barber" onPress={() => router.push('/barbers')} />
                     </View>
                  </View>
               )}
            </View>
            {!user && (
               <View className="gap-4 rounded-l bg-card p-2 shadow-sm">
                  <Text variant={'title3'}>Want to sign up as a Barber?</Text>
                  <View className="w-1/2 self-center">
                     <Button
                        title="Sign Up"
                        onPress={() =>
                           router.push({
                              pathname: '/login',
                              params: { mode: 'register', isBarber: 'true' },
                           })
                        }
                     />
                  </View>
               </View>
            )}
         </ParallaxScrollView>
      </View>
   );
};

export default Home;
