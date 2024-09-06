import { format, formatDistanceToNow, isPast } from 'date-fns';
import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '../nativewindui/Text';

import { useAuth } from '~/providers/AuthContext';
import { useAppointmentStore } from '~/providers/useAppointmentStore';
import { Appointment } from '~/shared/types';
import { getAppointmentDuration } from '~/utils/getAppointmentDuration';
import { getAppointmentPrice } from '~/utils/getAppointmentPrice';
import { useColorScheme } from '~/lib/useColorScheme';

type Props = {
   appointmentId: string;
   onPress: (item: Appointment) => void;
   actionsButton?: React.ReactNode;
};
const AppointmentCard = ({ appointmentId, onPress, actionsButton }: Props) => {
   const { user } = useAuth();
   const { getAppointment } = useAppointmentStore();
   const item = getAppointment(appointmentId);
   const { isDarkColorScheme } = useColorScheme();
   const duration = getAppointmentDuration(item.services);

   if (!item) return null;

   return (
      <View className={`my-1 items-center gap-2 rounded-md bg-card p-2 shadow-sm`}>
         <TouchableOpacity
            onPress={() => onPress(item)}
            className="my-1 flex-row items-center gap-2">
            <View style={{ width: '35%' }}>
               <Image
                  source={
                     item.customer.image
                        ? { uri: item.customer.image }
                        : require('~/assets/images/banner.png')
                  }
                  contentFit="cover"
                  tintColor={isDarkColorScheme && !item.customer.image ? 'white' : undefined}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
               />
               <View
                  className={`${item.status === 'confirmed' ? 'bg-green-400' : item.status === 'pending' ? 'bg-orange-400' : item.status === 'cancelled' ? 'bg-primary' : 'bg-gray-400'} absolute -bottom-1 left-0 right-0 w-[80%] rounded-2xl p-1 px-2`}>
                  <Text className="text-center text-sm font-semibold capitalize text-white">
                     {item.status}
                  </Text>
               </View>
            </View>
            <View className="flex-1">
               <Text variant="heading">
                  {user?.isBarber ? item.customer.name : item.barber.name}
               </Text>
               <View>
                  {/* <Text className="py-1 font-semibold text-muted">{names.join(', ')}</Text> */}
                  {item.services.map((s, index) => (
                     <Text className="font-semibold text-muted" key={s.id}>
                        {s.name} {s.quantity > 1 ? `x ${s.quantity}` : ''}{' '}
                        {index !== item.services.length - 1 && ','}
                     </Text>
                  ))}
               </View>
               <View className="flex-row items-center gap-x-2">
                  <Text className="text-sm  font-semibold text-muted">At {item.startTime}</Text>
                  <View className="h-1 w-1 rounded-full bg-muted" />
                  <Text className="text-sm  font-semibold text-muted">{duration} mins</Text>
               </View>
               <Text className="text-sm  font-semibold text-muted">
                  Price: ${getAppointmentPrice(item.services)}
               </Text>
               <Text className="text-sm  font-semibold text-muted">
                  {format(item.date, 'ccc - PPP')}
               </Text>
               <Text className="text-sm text-muted">
                  ({formatDistanceToNow(new Date(item.date))}){' '}
                  {isPast(new Date(item.date)) ? 'ago' : 'from now'}
               </Text>
            </View>
         </TouchableOpacity>
         {actionsButton && actionsButton}
      </View>
   );
};

export default AppointmentCard;
