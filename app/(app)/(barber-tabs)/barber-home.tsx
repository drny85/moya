import { Feather } from '@expo/vector-icons';
import { format, isPast, isToday } from 'date-fns';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedNumber from '~/components/AnimatedNumber';
import AppointmentCard from '~/components/Appointment/AppointmentCard';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';
import { useServices } from '~/hooks/useServices';
import { useAuth } from '~/providers/AuthContext';
import { useAppointmentStore } from '~/providers/useAppointmentStore';
import { calculateEarningsByFilter } from '~/utils/calculateEarningByFilter';
import { shareBarberLink } from '~/utils/shareBarberLink';

const BarberHome = () => {
   const { user } = useAuth();
   const { top } = useSafeAreaInsets();
   const { services, loading } = useServices(user?.id!);
   const data = useAppointmentStore((s) => s.appointments);
   const appointments = data.filter(
      (a) => a.status !== 'cancelled' && a.status !== 'completed' && !isPast(a.date)
   );
   const appointmentsData = useMemo(() => data.filter((a) => a.status !== 'cancelled'), [data]);

   const myNextAppointment = appointments.sort((a, b) =>
      new Date(a.date) > new Date(b.date) ? 1 : -1
   )[0];

   const waitinfForConfirmation = appointmentsData.filter(
      (a) => a.status === 'pending' && !isPast(a.date)
   );

   const allAppointments = useMemo(() => {
      return data
         .filter((appointment) => {
            return appointment.status !== 'cancelled' && isToday(appointment.date);
         })
         .reduce((total, appointment) => {
            const serviceEarnings = appointment.services.reduce((serviceTotal, service) => {
               return serviceTotal + service.price * service.quantity;
            }, 0);
            return total + serviceEarnings;
         }, 0);
   }, [data]);

   const confirmedTotal = calculateEarningsByFilter(appointmentsData, 'today', 'completed');

   if (!appointmentsData) return;

   return (
      <View className="flex-1 bg-background">
         <View className="flex-1 gap-2">
            <View
               style={{ paddingTop: top, height: '50%' }}
               className="rounded-3xl bg-card p-2 shadow-sm">
               <View className="flex-row items-center justify-between">
                  <Image
                     source={
                        user?.image ? { uri: user.image } : require('~/assets/images/banner.png')
                     }
                     style={{ height: 60, width: 60, borderRadius: 30, objectFit: 'cover' }}
                  />
                  <Text className="font-raleway text-2xl">Hi {user?.name?.split(' ')[0]}</Text>
                  <TouchableOpacity
                     onPress={() => shareBarberLink(user?.id!)}
                     className="h-10 w-10 items-center justify-center rounded-full bg-slate-200 p-1">
                     <Feather name="share" size={26} color="blue" />
                  </TouchableOpacity>
               </View>
               <Text className="mt-2 text-center">{new Date().toDateString()}</Text>
               <View className="mt-2 flex-1 items-center justify-center gap-4 p-2">
                  <Text variant={'title2'}>Estimated Earnings</Text>
                  <AnimatedNumber textStyle={{ fontSize: 40 }} value={allAppointments} />
                  <View className="w-full flex-row justify-evenly">
                     <View className="items-center justify-center">
                        <Text className="text-muted">Earned</Text>
                        <AnimatedNumber value={confirmedTotal} />
                     </View>
                     <View className="items-center justify-center">
                        <Text className="text-muted">Pending</Text>
                        <AnimatedNumber value={allAppointments - confirmedTotal} />
                     </View>
                  </View>
               </View>
            </View>
            {!loading && services.length === 0 && (
               <View className="w-full items-center justify-center gap-2 p-2">
                  <Text className="text-center text-xl text-muted">No services available</Text>
                  <Button
                     textStyle={{ paddingHorizontal: 20 }}
                     title="Add Service"
                     onPress={() => {
                        router.push({
                           pathname: '/(barber-tabs)/gallery',
                           params: { show: 'true' },
                        });
                     }}
                  />
               </View>
            )}
            <ScrollView className="flex-1" contentContainerClassName="gap-2">
               <View className="bg-card p-2">
                  <Text variant={'title3'}>My Next Appointment</Text>
                  {myNextAppointment ? (
                     <AppointmentCard
                        appointmentId={myNextAppointment.id!}
                        onPress={() => {
                           router.push({
                              pathname: '/barber-appointment-view',
                              params: { appointmentId: myNextAppointment.id },
                           });
                        }}
                     />
                  ) : (
                     <View className="my-2">
                        <Text className="text-muted">No Appointments Scheduled</Text>
                     </View>
                  )}
               </View>
               <View className="rounded-md bg-card p-2 shadow-sm">
                  <Text variant={'title3'}>
                     Waiting for confirmation ({waitinfForConfirmation.length})
                  </Text>
                  <FlatList
                     data={waitinfForConfirmation.sort((a, b) => (a.date > b.date ? 1 : -1))}
                     horizontal
                     ListEmptyComponent={
                        <View className="p-2">
                           <Text className="text-muted dark:text-white">No appointments</Text>
                        </View>
                     }
                     renderItem={({ item }) => {
                        return (
                           <TouchableOpacity
                              onPress={() =>
                                 router.push({
                                    pathname: '/barber-appointment-view',
                                    params: { appointmentId: item.id },
                                 })
                              }
                              className="m-2 items-center justify-center rounded-md bg-background p-2 shadow-sm">
                              <Text className="font-semibold">{format(item.date, 'eee')}</Text>
                              <Text>{item.startTime}</Text>
                           </TouchableOpacity>
                        );
                     }}
                  />
               </View>
            </ScrollView>
         </View>
      </View>
   );

   return (
      <Container>
         <View className="mx-3 mb-2 flex-row items-center justify-between">
            <Text className="text-center font-raleway text-xl">
               Welcome {user?.name?.split(' ')[0]}
            </Text>
            <TouchableOpacity
               onPress={() => shareBarberLink(user?.id!)}
               className="h-10 w-10 items-center justify-center rounded-full bg-slate-300 p-1">
               <Feather name="share" size={26} color="blue" />
            </TouchableOpacity>
         </View>
         <ScrollView contentContainerClassName="gap-3">
            <View className="rounded-md bg-card p-2 shadow-sm">
               <Text variant={'title3'}>My Next Appointment</Text>
               {myNextAppointment ? (
                  <AppointmentCard
                     appointmentId={myNextAppointment.id!}
                     onPress={() => {
                        router.push({
                           pathname: '/barber-appointment-view',
                           params: { appointmentId: myNextAppointment.id },
                        });
                     }}
                  />
               ) : (
                  <View className="my-2">
                     <Text className="text-muted">No Appointments Scheduled</Text>
                  </View>
               )}
            </View>
            <View className="rounded-md bg-card p-2 shadow-sm">
               <Text variant={'title3'}>
                  Waiting for confirmation ({waitinfForConfirmation.length})
               </Text>
               <TouchableOpacity
                  disabled={waitinfForConfirmation.length === 0}
                  onPress={() => router.push('/barber-appointments')}>
                  <View className="mt-1 flex-row flex-wrap gap-2">
                     {waitinfForConfirmation.map((c, index) => (
                        <View className="flex-row items-center gap-1" key={c.startTime}>
                           <Text>{c.startTime} </Text>
                           {waitinfForConfirmation.length - 1 !== index && (
                              <View className="h-1 w-1 rounded-full bg-slate-400" />
                           )}
                        </View>
                     ))}
                     {waitinfForConfirmation.length === 0 && (
                        <Text className="text-muted">No appointments</Text>
                     )}
                  </View>
               </TouchableOpacity>
            </View>
            <View className="rounded-md bg-card p-2 shadow-sm">
               <Text className="text-center" variant={'title3'}>
                  Today's Earnings
               </Text>

               <View className="items-center justify-center p-2">
                  <Text>Estimated</Text>
                  <Text>${allAppointments.toFixed(2)}</Text>
               </View>
               <View className="flex-row justify-evenly p-2">
                  <View className="items-center justify-center">
                     <Text className="text-muted">Earned</Text>
                     <Text>${confirmedTotal.toFixed(2)}</Text>
                  </View>
                  <View className="items-center justify-center">
                     <Text className="text-muted">Pending</Text>
                     <Text>${(allAppointments - confirmedTotal).toFixed(2)}</Text>
                  </View>
               </View>
            </View>
         </ScrollView>
      </Container>
   );
};

export default BarberHome;
