import { FontAwesome5 } from '@expo/vector-icons';
import { addMinutes, format, formatDistanceToNow, isPast } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateAppointmentInDatabase } from '~/actions/appointments';

import { Button } from '~/components/Button';
import CommunicationButtons from '~/components/CommunicationButtons';
import MapHeader from '~/components/MapHeader';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAppointmentStore } from '~/providers/useAppointmentStore';
import { getAppointmentDuration } from '~/utils/getAppointmentDuration';
import { getBookingDate } from '~/utils/getBookingDate';
import { openMapWithNavigation } from '~/utils/openMapWithNavigation';

const COORDS = {
   latitude: 40.83728,
   longitude: -73.90757,
};

type ParamsProps = {
   appointmentId: string;
};
const AppointmentDetails = () => {
   const { bottom } = useSafeAreaInsets();
   const { appointmentId } = useLocalSearchParams<ParamsProps>();
   const { getAppointment } = useAppointmentStore();
   const appointment = getAppointment(appointmentId);
   const duration = getAppointmentDuration(appointment.services);
   const price = appointment.services.reduce((acc, curr) => acc + curr.price, 0);
   const { isDarkColorScheme } = useColorScheme();

   const handleCancelAppointment = async () => {
      try {
         if (!appointment) return;
         await updateAppointmentInDatabase({
            ...appointment,
            status: 'cancelled',
            changesMadeBy: 'customer',
         });
      } catch (error) {
         console.log('Error updating appointment', error);
      }
   };
   if (!appointment) return null;
   return (
      <View style={{ flex: 1 }}>
         <MapHeader shouldGoBack={true} />
         <ScrollView style={{ flex: 0.6 }}>
            <View className="m-2 rounded-lg bg-card p-4 shadow-sm">
               <View className="flex-row items-center justify-between">
                  <Text variant={'title3'}>Appointment Details</Text>
                  <TouchableOpacity
                     className="rounded-full bg-card px-3 py-2"
                     onPress={() => openMapWithNavigation(COORDS.latitude, COORDS.longitude)}>
                     <View className="flex-row items-center gap-2">
                        <FontAwesome5
                           name="directions"
                           size={22}
                           color={isDarkColorScheme ? 'white' : 'black'}
                        />
                        <Text className="text-sm font-semibold text-muted dark:text-white">
                           Directions
                        </Text>
                     </View>
                  </TouchableOpacity>
               </View>
               <View className="mt-2 flex-row items-center justify-between gap-3">
                  <Pressable
                     onPress={() =>
                        router.push({
                           pathname: '/barber',
                           params: { barberId: appointment.barber.id },
                        })
                     }>
                     <Image
                        source={
                           appointment.barber.image
                              ? { uri: appointment.barber.image }
                              : require('~/assets/images/banner.png')
                        }
                        className="h-20 w-20 rounded-full object-cover"
                     />
                  </Pressable>
                  <View>
                     <Text variant="heading">{appointment.barber.name}</Text>
                     <Text className="text-muted dark:text-white">1420 Clay Ave</Text>
                     <Text className="text-muted dark:text-white">{appointment.barber.phone}</Text>
                  </View>

                  <CommunicationButtons phone={appointment.barber.phone} />
               </View>
            </View>
            <View className="m-2 gap-1 rounded-lg bg-card p-4 shadow-sm">
               <Text variant={'title3'}>Service Details</Text>
               <View>
                  {appointment.services.map((s, index) => (
                     <Text variant={'heading'} className="text-muted dark:text-white" key={s.id}>
                        {s.name} {s.quantity > 1 ? `x ${s.quantity}` : ''}
                        {index !== appointment.services.length - 1 && ','}
                     </Text>
                  ))}
               </View>
               <View className="mt-2 flex-row items-center gap-3">
                  <Text className="text-muted dark:text-white">{duration} mins</Text>
                  <View className="h-1 w-1 rounded-full bg-slate-400" />
                  <Text className="text-muted dark:text-white">${price} </Text>
               </View>
               <Text className="text-muted dark:text-white">
                  {format(appointment.date, 'E, PPP')}
               </Text>
               <Text className="text-muted dark:text-white">
                  {appointment.startTime} -{' '}
                  {format(
                     addMinutes(
                        getBookingDate(new Date(appointment.date), appointment.startTime),
                        duration || 40
                     ),
                     'p'
                  )}
               </Text>
               <Text className="text-sm text-muted dark:text-white">
                  ({formatDistanceToNow(new Date(appointment.date))}){' '}
                  {isPast(new Date(appointment.date)) ? 'ago' : 'from now'}
               </Text>
            </View>
            <View className={`my-2 w-1/2 self-center rounded-full bg-card px-3 shadow-sm`}>
               <Text
                  className={`my-2 text-center text-xl font-bold capitalize  ${appointment.status === 'pending' ? 'text-orange-400' : appointment.status === 'confirmed' ? 'text-green-400' : appointment.status === 'cancelled' ? 'text-red-500' : 'text-slate-600'}`}>
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
                  title="Re-Schedule"
                  iconName="calendar-o"
                  style={{ paddingHorizontal: 30 }}
                  onPress={() => {
                     router.push({
                        pathname: '/booking',
                        params: {
                           appointmentId: appointmentId.toString(),
                           barberId: appointment.barber.id.toString(),
                        },
                     });
                  }}
               />
            </View>
         )}
      </View>
   );
};

export default AppointmentDetails;
