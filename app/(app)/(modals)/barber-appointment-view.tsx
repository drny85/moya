import { Feather } from '@expo/vector-icons';
import { addMinutes, format, formatDistanceToNow, isPast, isSameDay } from 'date-fns';
import { BlurView } from 'expo-blur';

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, TouchableOpacity, View, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateAppointmentInDatabase } from '~/actions/appointments';

import { Button } from '~/components/Button';
import CommunicationButtons from '~/components/CommunicationButtons';

import { Text } from '~/components/nativewindui/Text';
import { toastAlert, toastMessage } from '~/lib/toast';
import { useAuth } from '~/providers/AuthContext';
import { useAppointmentStore } from '~/providers/useAppointmentStore';
import { getAppointmentDuration } from '~/utils/getAppointmentDuration';
import { getAppointmentPrice } from '~/utils/getAppointmentPrice';
import { getBookingDate } from '~/utils/getBookingDate';

type ParamsProps = {
   appointmentId: string;
};
const BarberAppointmentView = () => {
   const { user } = useAuth();

   const { bottom, top } = useSafeAreaInsets();
   const { appointmentId } = useLocalSearchParams<ParamsProps>();
   const { getAppointment } = useAppointmentStore();
   const appointment = getAppointment(appointmentId);

   const handleCancelAppointment = async () => {
      try {
         if (!appointment) return;
         await updateAppointmentInDatabase({
            ...appointment,
            status: 'cancelled',
            changesMadeBy: 'barber',
         });
      } catch (error) {
         console.log('Error updating appointment', error);
      }
   };
   if (!appointment) return null;

   if (!user?.isBarber) return <Redirect href={'/(app)/(tabs)'} />;
   return (
      <View style={{ flex: 1 }}>
         <ImageBackground
            source={
               appointment.customer.image
                  ? { uri: appointment.customer.image }
                  : require('~/assets/images/banner.png')
            }
            style={{ flex: 0.5, overflow: 'hidden', borderRadius: 30 }}
            resizeMode="cover">
            <TouchableOpacity
               onPress={router.back}
               style={{ top }}
               className="absolute left-2 z-30 rounded-full bg-slate-300 p-1">
               <Feather name="chevron-left" size={30} color="blue" />
            </TouchableOpacity>
            <BlurView
               intensity={40}
               tint="prominent"
               className="absolute bottom-0 left-0 right-0 z-10 gap-1 overflow-hidden p-4">
               <View className="flex-row items-center justify-between gap-4 ">
                  <Text variant="title2" className=" text-slate-500  dark:text-white">
                     {appointment.customer.name}
                  </Text>
                  <View className="w-1/3  flex-row self-end">
                     <CommunicationButtons phone={appointment.customer.phone!} />
                  </View>
               </View>
            </BlurView>
         </ImageBackground>
         <ScrollView style={{ flex: 0.6 }}>
            <View className="m-2 gap-1 rounded-lg bg-card p-4 shadow-sm">
               <Text className="text-xl font-semibold">Service Details</Text>
               <View>
                  {appointment.services.map((s, index) => (
                     <Text className="font-raleway-bold text-muted  dark:text-white" key={s.id}>
                        {s.name} {s.quantity > 1 ? `x ${s.quantity}` : ''}
                        {index !== appointment.services.length - 1 && ','}
                     </Text>
                  ))}
               </View>
               <View className="flex-row items-center gap-3">
                  <Text className="text-muted dark:text-white">
                     {getAppointmentDuration(appointment.services)} mins
                  </Text>
                  <View className="h-1 w-1 rounded-full bg-slate-400" />
                  <Text className="text-muted  dark:text-white">
                     ${getAppointmentPrice(appointment.services)}
                  </Text>
               </View>
               <Text className="text-muted  dark:text-white">
                  {format(appointment.date, 'PPP')}
               </Text>
               <Text className="text-muted  dark:text-white">
                  {appointment.startTime} -{' '}
                  {format(
                     addMinutes(
                        getBookingDate(new Date(appointment.date), appointment.startTime),
                        getAppointmentDuration(appointment.services) || 40
                     ),
                     'p'
                  )}
               </Text>
               <Text className="text-sm text-muted  dark:text-white">
                  ({formatDistanceToNow(new Date(appointment.date))}){' '}
                  {isPast(new Date(appointment.date)) ? 'ago' : 'from now'}
               </Text>
               {appointment.updatedCount > 0 && (
                  <Text className="py-2 text-center text-sm font-semibold text-muted">
                     Changes Made {appointment.updatedCount}
                  </Text>
               )}
            </View>
            <Text className="text-center text-lg text-muted  dark:text-white">Status</Text>
            <View className={`my-2 w-1/2 self-center rounded-full bg-card px-3 shadow-sm`}>
               <Text
                  className={`my-2 text-center text-xl font-bold capitalize ${appointment.status === 'pending' ? 'text-orange-400' : appointment.status === 'confirmed' ? 'text-green-400' : appointment.status === 'cancelled' ? 'text-red-500' : 'text-slate-600'}`}>
                  {appointment.status}
               </Text>
            </View>
         </ScrollView>
         {appointment.status === 'pending' && (
            <View style={{ paddingBottom: bottom }} className="flex-row justify-evenly">
               <Button
                  textStyle={{ color: 'orange' }}
                  style={{ backgroundColor: '#fff', paddingHorizontal: 30 }}
                  title="Cancel"
                  onPress={() =>
                     Alert.alert(
                        'Are you sure you want to cancel this appointment?',
                        'This action cannot be undone.',
                        [
                           {
                              text: 'Cancel',
                              style: 'cancel',
                           },
                           {
                              text: 'Yes, Cancel it',
                              style: 'destructive',
                              onPress: handleCancelAppointment,
                              // Perform cancellation logic here
                           },
                        ]
                     )
                  }
               />
               <Button
                  title="Confirm"
                  iconName="thumbs-up"
                  style={{ paddingHorizontal: 30 }}
                  onPress={async () => {
                     const updated = await updateAppointmentInDatabase({
                        ...appointment,
                        status: 'confirmed',
                        changesMadeBy: 'barber',
                     });

                     if (updated) {
                        toastMessage({
                           title: 'Confirmed',
                           message: 'The appointment has been confirmed',
                           preset: 'done',
                           duration: 2,
                        });

                        router.back();
                     }
                  }}
               />
            </View>
         )}
         {appointment.status === 'confirmed' && (
            <View style={{ paddingBottom: bottom }} className="w-1/2 self-center">
               <Button
                  title="Mark Complete"
                  onPress={() => {
                     if (!isSameDay(appointment.date, new Date())) {
                        return toastAlert({
                           title: 'Appointment is not for today',
                           message: 'Please do not mark the appointment as complete',
                           preset: 'error',
                        });
                     }
                     updateAppointmentInDatabase({
                        ...appointment,
                        status: 'completed',
                        changesMadeBy: 'barber',
                     });
                  }}
               />
            </View>
         )}
      </View>
   );
};

export default BarberAppointmentView;
