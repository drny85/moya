import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import AppointmentCard from '~/components/Appointment/AppointmentCard';
import { Button } from '~/components/Button';
import ConfettiComponent, { ConfettiComponentRef } from '~/components/ConfettiComponent';
import { Text } from '~/components/nativewindui/Text';
import { useAppointmentStore } from '~/providers/useAppointmentStore';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { COLORS } from '~/theme/colors';
import { useAuth } from '~/providers/AuthContext';
import { useColorScheme } from '~/lib/useColorScheme';

const VALUES = ['Upcoming', 'Past'];

type ParamsProps = {
   confetti?: string;
};
const AppointmentPage = () => {
   const { user } = useAuth();
   const { confetti } = useLocalSearchParams<ParamsProps>();
   const { colors } = useColorScheme();
   const [selectedIndex, setSelectedIndex] = useState(0);
   const appointments = useAppointmentStore((s) =>
      s.appointments.filter((appointment) => appointment.customer.id === user?.id)
   );
   const confettiRef = useRef<ConfettiComponentRef>(null);
   const data = useMemo(
      () => appointments.sort((a, b) => (a.date < b.date ? 1 : -1)),
      [appointments]
   );

   const pastAppointmens = data
      .filter((item) => new Date(item.date) < new Date())
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));

   const upcomingAppointments = data
      .filter((item) => new Date(item.date) >= new Date())
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));

   useEffect(() => {
      if (confetti) {
         confettiRef.current?.triggerConfetti();
      }
   }, [confetti]);

   return (
      <View className="flex-1 p-1">
         <SegmentedControl
            values={VALUES}
            fontStyle={{ fontSize: 16, color: '#212121' }}
            tintColor={COLORS.light.accent}
            activeFontStyle={{ color: '#ffffff', fontWeight: '700', fontSize: 18 }}
            style={{
               backgroundColor: colors.card,
               height: 40,
               width: '70%',
               alignSelf: 'center',
            }}
            selectedIndex={selectedIndex}
            onChange={(event) => {
               setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
            }}
         />
         <FlashList
            data={selectedIndex === 0 ? upcomingAppointments : pastAppointmens}
            estimatedItemSize={100}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
               <View className="mx-3 gap-10">
                  <Text className=" mt-10 text-center text-xl text-muted">
                     No Appointments Scheduled
                  </Text>
                  {selectedIndex === 1 && (
                     <View className="w-1/2 self-center">
                        <Button title="Book Appointment" onPress={() => router.push('/barbers')} />
                     </View>
                  )}
               </View>
            }
            contentContainerClassName="p-2"
            renderItem={({ item }) => (
               <AppointmentCard
                  appointmentId={item.id!}
                  onPress={() =>
                     router.push({ pathname: '/appointment', params: { appointmentId: item.id } })
                  }
               />
            )}
         />
         <ConfettiComponent
            ref={confettiRef} // <reference path="" />
         />
      </View>
   );
};

export default AppointmentPage;
