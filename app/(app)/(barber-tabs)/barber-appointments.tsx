import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { FlashList } from '@shopify/flash-list';
import { isSameDay } from 'date-fns';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { updateAppointmentInDatabase } from '~/actions/appointments';
import AppointmentCard from '~/components/Appointment/AppointmentCard';
import WeekSelector from '~/components/Appointment/WeekSelectorComponent';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';
import { DEFAULT_SCHEDULE } from '~/constants';
import { toastAlert } from '~/lib/toast';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/providers/AuthContext';
import { useAppointmentStore } from '~/providers/useAppointmentStore';
import { Appointment } from '~/shared/types';
import { COLORS } from '~/theme/colors';

const VALUES = ['Today', 'Calendar', 'Upcoming'];

const BarberAppointments = () => {
   const { colors, isDarkColorScheme } = useColorScheme();
   const appointments = useAppointmentStore((s) =>
      s.appointments.sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1))
   );
   const [day, setDate] = useState(new Date());
   const { user } = useAuth();
   const [selectedIndex, setSelectedIndex] = useState(0);

   const appointmentsByDate = useMemo(() => {
      return appointments.filter((appointment) => isSameDay(appointment.date, day));
   }, [appointments, day]);

   const todayAppoinments = useMemo(() => {
      return appointments.filter((appointment) => isSameDay(appointment.date, new Date()));
   }, [appointments]);

   const upcomingAppointments = useMemo(() => {
      return appointments.filter(
         (appointment) =>
            appointment.status !== 'cancelled' && new Date(appointment.date) > new Date()
      );
   }, [appointments]);

   const data = useMemo(() => {
      if (selectedIndex === 0) {
         return todayAppoinments;
      }
      if (selectedIndex === 1) {
         return appointmentsByDate;
      }
      if (selectedIndex === 2) {
         return upcomingAppointments;
      }
   }, [selectedIndex, appointmentsByDate, todayAppoinments, upcomingAppointments]);
   return (
      <Container>
         <SegmentedControl
            values={VALUES}
            fontStyle={{ fontSize: 16, color: isDarkColorScheme ? 'white' : 'black' }}
            tintColor={colors.accent}
            activeFontStyle={{
               color: !isDarkColorScheme ? 'white' : 'black',
               fontWeight: '700',
               fontSize: 18,
            }}
            style={{
               backgroundColor: colors.background,
               height: 40,
               width: '80%',
               alignSelf: 'center',
               marginBottom: 10,
            }}
            selectedIndex={selectedIndex}
            onChange={(event) => {
               setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
            }}
         />
         {selectedIndex === 1 && (
            <View className="m-1 min-h-36 rounded-md bg-card shadow-sm">
               <WeekSelector
                  schedule={(user?.isBarber && user.schedule) || DEFAULT_SCHEDULE}
                  onPress={(day) => {
                     setDate(day);
                  }}
               />
            </View>
         )}
         <View className="mx-2 flex-1">
            <FlashList
               ListHeaderComponent={
                  data && data.length > 0 ? (
                     <View>
                        <Text className="px-4 py-2 text-center font-semibold text-muted dark:text-white">
                           {data.length} Appointments
                        </Text>
                     </View>
                  ) : null
               }
               data={data}
               ListEmptyComponent={
                  <View className="mt-10 flex-1 items-center justify-center">
                     <Text className="text-center font-semibold text-muted">
                        No Appointments Scheduled
                     </Text>
                  </View>
               }
               contentContainerClassName="p-1"
               showsVerticalScrollIndicator={false}
               estimatedItemSize={120}
               renderItem={({ item }) => (
                  <AppointmentCard
                     appointmentId={item.id!}
                     onPress={() => {
                        router.push({
                           pathname: '/barber-appointment-view',
                           params: { appointmentId: item.id },
                        });
                     }}
                     actionsButton={
                        item.status !== 'completed' && <ActionButtons appointment={item} />
                     }
                  />
               )}
            />
         </View>
      </Container>
   );
};

export default BarberAppointments;

const ActionButtons = ({ appointment }: { appointment: Appointment }) => {
   const { colors } = useColorScheme();
   const handleActions = () => {
      if (appointment.status === 'pending') {
         updateAppointmentInDatabase({
            ...appointment,
            status: 'confirmed',
            changesMadeBy: 'barber',
         });
         // handle confirm
      }
      if (appointment.status === 'confirmed') {
         if (!isSameDay(appointment.date, new Date())) {
            toastAlert({
               title: 'Appointmet Not Today',
               message: 'You can only complete appointments scheduled for today.',
               preset: 'error',
            });
            return;
         }
         updateAppointmentInDatabase({
            ...appointment,
            status: 'completed',
            changesMadeBy: 'barber',
         });
         // handle complete
      }
   };

   const handleCancelAppointment = () => {
      if (appointment.status === 'confirmed') {
         Alert.alert(
            'Appointment is confirmed',
            'Are you sure that you want to cancel this appointment',
            [
               {
                  text: 'No',
                  style: 'cancel',
               },
               {
                  text: 'OK, Cancel it',
                  onPress: () => {
                     updateAppointmentInDatabase({
                        ...appointment,
                        status: 'cancelled',
                        changesMadeBy: 'barber',
                     });
                  },
               },
            ]
         );
      } else if (appointment.status === 'completed') {
         return Alert.alert(
            'Appointment is completed',
            'This appointment has already been completed and cannot be cancelled.'
         );
      } else {
         Alert.alert('Cancel Appointment', 'Are you sure you want to cancel this appointment?', [
            {
               text: 'Cancel',
               style: 'cancel',
            },
            {
               text: 'Yes',
               style: 'destructive',
               onPress: () => {
                  updateAppointmentInDatabase({
                     ...appointment,
                     status: 'cancelled',
                     changesMadeBy: 'barber',
                  });
               },
            },
         ]);
      }
   };

   return (
      <View className="mt-2 w-full flex-1 flex-row justify-evenly">
         <Button
            disabled={appointment.status === 'cancelled' || appointment.status === 'confirmed'}
            onPress={() => {
               Alert.alert(
                  'Cancel Appointment',
                  'Are you sure you want to cancel this appointment?',
                  [
                     {
                        text: 'Cancel',
                        style: 'cancel',
                     },
                     {
                        text: 'Yes',
                        style: 'destructive',
                        onPress: handleCancelAppointment,
                     },
                  ]
               );
            }}
            style={{ backgroundColor: COLORS.light.grey3, paddingHorizontal: 16 }}
            title="Cancel"
         />
         <Button
            style={{
               paddingVertical: 1,
               backgroundColor: appointment.status === 'cancelled' ? 'red' : colors.primary,
            }}
            onPress={handleActions}
            title={
               appointment.status === 'confirmed'
                  ? 'Complete'
                  : appointment.status === 'pending'
                    ? 'Confirm'
                    : 'No Action'
            }
         />
      </View>
   );
};
