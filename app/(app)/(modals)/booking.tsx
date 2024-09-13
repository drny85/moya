import { FontAwesome } from '@expo/vector-icons';
import { isPast, isSameDay } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateAppointmentInDatabase } from '~/actions/appointments';

import AppointmentDatePicker from '~/components/Appointment/AppointmentDatePicker';
import DateTimeAppointmentPicker from '~/components/Appointment/DateTimeAppointmentPicker';
import ServicePicker from '~/components/Appointment/ServicePicker';
import BarberImageHeader from '~/components/BarberImageHeader';
import { Button } from '~/components/Button';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';
import { Text } from '~/components/nativewindui/Text';
import { useServices } from '~/hooks/useServices';
import { toastAlert, toastMessage } from '~/lib/toast';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/providers/AuthContext';
import { useAppointmentStore } from '~/providers/useAppointmentStore';
import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore';
import { useBarbersStore } from '~/providers/useBarbersStore';
import { Appointment } from '~/shared/types';
import { appointmentsConflict } from '~/utils/appointmentsConflict';
import { objectsAreDifferent } from '~/utils/compareTwoObjects';
import { getAppointmentDuration } from '~/utils/getAppointmentDuration';
import { getAppointmentPrice } from '~/utils/getAppointmentPrice';
import { getBookingDate } from '~/utils/getBookingDate';

type ParamProps = {
   barberId: string;
   appointmentId?: string;
};

const BookingPage = () => {
   const { barberId, appointmentId } = useLocalSearchParams<ParamProps>();
   const { loading, services } = useServices(barberId);
   const { colors } = useColorScheme();
   const barbers = useBarbersStore((state) => state.barbers);
   const { user } = useAuth();
   const barber = barbers.find((barber) => barber.id === barberId);

   const {
      setSelectedTimeSlot,
      setIndex,
      selectedServices,
      selectedTimeSlot,
      setSelectedDate,
      setServices,
      selectedDate,
   } = useAppointmentFlowStore();
   const { addNewAppointment, getAppointment, appointments } = useAppointmentStore();
   const { bottom } = useSafeAreaInsets();
   const alreadyHaveAnAppointmentToday =
      appointments.findIndex(
         (appointment) =>
            appointment.customer.id === user?.id &&
            appointment.status !== 'cancelled' &&
            !isPast(appointment.date) &&
            isSameDay(appointment.date, selectedDate)
      ) !== -1;

   const bottomSheetModalRef = useSheetRef();

   const handleSchuduleAppointment = async () => {
      if (selectedServices.length === 0) {
         toastAlert({
            title: 'Service Required',
            message: 'You must select a service to book an appointment',
            preset: 'custom',
            duration: 3,
            iconName: 'hand.raised.slash',
         });
         return;
      }
      if (!selectedDate || !selectedTimeSlot) {
         bottomSheetModalRef.current?.present();
         return;
      }

      if (alreadyHaveAnAppointmentToday && !appointmentId) {
         toastAlert({
            title: 'Appointment Conflict',
            message:
               'You already have an appointment today\nPlease just update that appointmet or cancel and book another one',
            preset: 'custom',
            duration: 5,
            iconName: 'hand.raised.slash',
         });
         return;
      }

      if (appointmentId) {
         const app = getAppointment(appointmentId);
         const updatedAppointment = {
            ...app,
            services: selectedServices,
            //updatedCount: app.updatedCount ? app.updatedCount + 1 : 1,
            date: selectedDate.toISOString(),
            startTime: selectedTimeSlot.time,
         };

         const isThereAnyChanges = objectsAreDifferent(app, updatedAppointment);

         if (!isThereAnyChanges) {
            Alert.alert('No changes made');
            router.back();
            return;
         }

         // const thereIsConflict = appointmentsConflict(
         //    appointments,
         //    updatedAppointment.date,
         //    getAppointmentDuration(updatedAppointment.services)
         // );

         // if (thereIsConflict) {
         //    return toastAlert({
         //       title: 'Appointment Conflict',
         //       message: 'Please consider changing the time or services',
         //       preset: 'custom',
         //       duration: 3,
         //       iconName: 'hand.raised.slash',
         //    });
         // }

         const updated = await updateAppointmentInDatabase({
            ...updatedAppointment,
            updatedCount: app.updatedCount + 1,
         });
         if (updated) {
            toastMessage({
               title: 'Appointment updated',
               message: 'Your appointment has been updated',
               preset: 'done',
               duration: 2,
            });
            bottomSheetModalRef.current?.close();
            router.back();
         }

         return;
      }
      try {
         if (!barber || !user) return;
         const d = getBookingDate(selectedDate, selectedTimeSlot?.time);
         const appointment: Appointment = {
            barber: {
               id: barber.id,
               name: barber.name,
               image: barber.image,
               phone: barber.phone,
               pushToken: barber.pushToken,
            },
            reminderSent: false,
            customer: {
               id: user.id,
               name: user.name,
               image: user.image,
               phone: user.phone,
               pushToken: user.pushToken || null,
            },
            services: selectedServices,
            updatedCount: 0,
            date: d.toISOString(),
            startTime: selectedTimeSlot?.time,
            status: 'pending',
            changesMadeBy: 'customer',
         };

         const thereIsConflict = appointmentsConflict(
            appointments,
            appointment.date,
            getAppointmentDuration(appointment.services),
            user.id!
         );

         if (thereIsConflict) {
            return toastAlert({
               title: 'Appointment Conflict',
               message: 'Please consider changing the time or services',
               preset: 'custom',
               duration: 3,
               iconName: 'hand.raised.slash',
            });
         }

         const saved = await addNewAppointment(appointment);
         if (saved) {
            setSelectedTimeSlot(null);
            setIndex(0);
            setSelectedDate(new Date());
            setServices([]);
            toastMessage({
               title: 'Appointment booked',
               message: 'Your appointment has been booked',
               preset: 'done',
               duration: 2,
            });
            bottomSheetModalRef.current?.close();
            router.dismiss();
            router.replace({ pathname: '/appointments', params: { confetti: 'yes' } });
         }
      } catch (error) {
         console.log('��� ~ file: #barber.tsx:58 ~ handleSchuduleAppointment ~ error:', error);
      }
   };

   const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
         setIndex(0);
      }
   }, []);

   useEffect(() => {
      if (appointmentId) {
         const appointment = getAppointment(appointmentId);

         if (appointment) {
            setSelectedTimeSlot({ time: appointment.startTime, isBooked: true });
            setSelectedDate(new Date(appointment.date));
            setServices(appointment.services);
            // setSelectedServiceOrRemoveService(appointment);
         }
      }
   }, [appointmentId]);

   if (!barber || loading) return null;

   return (
      <View className="flex-1 justify-between">
         <StatusBar style="light" />
         <BarberImageHeader
            //toggleFavorite={toggleFavorite}
            barber={barber}
            onPressBack={() => {
               setSelectedDate(new Date());
               setServices([]);
               setSelectedTimeSlot(null);
               router.back();
            }}
         />
         <ScrollView showsVerticalScrollIndicator={false} className="my-2">
            {services.length > 0 && barber.isAvailable && (
               <ServicePicker services={services} isBarber={false} />
            )}
            {barber.isAvailable && services.length > 0 && (
               <AppointmentDatePicker
                  onPress={() => {
                     if (selectedServices.length === 0) {
                        toastAlert({
                           title: 'Service Required',
                           message: 'You must select a service to book an appointment',
                           preset: 'custom',
                           duration: 3,
                           iconName: 'hand.raised.slash',
                        });
                        return;
                     }
                     bottomSheetModalRef.current?.present();
                  }}
               />
            )}
            {services.length === 0 && (
               <View className="mt-10 flex-1 items-center justify-center p-2">
                  <Text className="text-center text-xl text-muted">
                     {barber.name} has not listed any services yet. Please let him know!
                  </Text>
               </View>
            )}
            {!barber.isAvailable && (
               <View className="flex-1 items-center justify-center">
                  <Text className="text-center text-xl text-muted">
                     {barber.name} is not available today
                  </Text>
               </View>
            )}
         </ScrollView>

         <View
            className="shas rounded-3xl bg-card"
            style={{
               marginBottom: bottom,
               shadowOffset: { width: -2, height: -2 },
               shadowRadius: 3,
               shadowOpacity: 0.5,
               shadowColor: colors.grey,
            }}>
            {/* {selectedDate && selectedTimeSlot && (
          <Text className="py-2 text-center text-sm font-semibold text-muted">
            {format(getBookingDate(selectedDate, selectedTimeSlot?.time), 'PPP p')}
          </Text>
        )} */}
            <View className="my-3 flex-row items-start gap-2 self-center">
               <FontAwesome name="money" size={24} color="grey" />
               <Text className="text-center text-muted dark:text-white">
                  ${selectedServices.length > 0 && getAppointmentPrice(selectedServices)} Cash Only
               </Text>
            </View>
            <View className="w-[80%] self-center">
               <Button
                  disabled={!barber.isAvailable || services.length === 0}
                  title={appointmentId ? 'Update Appointment' : 'Book Now'}
                  style={{ opacity: !barber.isAvailable || services.length === 0 ? 0.5 : 1 }}
                  onPress={handleSchuduleAppointment}
               />
            </View>
         </View>
         <Sheet
            ref={bottomSheetModalRef}
            handleIndicatorStyle={{ backgroundColor: colors.primary }}
            snapPoints={['70%']}
            onChange={handleSheetChanges}>
            <View className="mt-5 flex-1 items-center justify-center bg-card pb-8">
               <DateTimeAppointmentPicker
                  barber={barber}
                  onPress={() => bottomSheetModalRef.current?.close()}
               />
            </View>
         </Sheet>
      </View>
   );
};

export default BookingPage;
