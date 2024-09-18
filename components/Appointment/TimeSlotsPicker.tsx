// TimeSlotPicker.tsx
import { addDays, format, isSameDay } from 'date-fns';
import { router, useSegments } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';

import { Text } from '../nativewindui/Text';

import { useAppointmentStore } from '~/providers/useAppointmentStore';
import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore';

import { generateAvailableTimeSlots } from '~/utils/getTimeSlots';
import { Button } from '../Button';
import { Barber, Days, TimeSlot } from '~/shared/types';
import { addUnavailableTimeSlots } from '~/utils/addUnavailableTimeSlots';

const _spacing = 10;

type TimeSlotPickerProps = {
   barber: Barber;
   date?: Date;
   onTilePress?: (time: TimeSlot) => void;
};

const TimeSlotPickerComponent: React.FC<TimeSlotPickerProps> = ({ barber, date, onTilePress }) => {
   const segment = useSegments() as string[];
   const changeColor = segment.includes('barber');
   const { appointments: data } = useAppointmentStore();
   const appointments = data.filter((a) => a.barber.id === barber.id);

   const {
      selectedTimeSlot,
      setSelectedTimeSlot,
      index,
      setIndex,
      selectedDate,
      setSelectedDate,
      selectedServices,
   } = useAppointmentFlowStore();
   const ref = useRef<FlatList>(null);

   const handleTimeSelect = (time: TimeSlot) => {
      setSelectedTimeSlot(time);
   };

   const day = date ? date : selectedDate;
   const shortDay = format(day, 'E') as Days;
   const isDayOff = (barber?.schedule[shortDay]).isOff;
   const startTime: string = barber?.schedule[shortDay].startTime;
   const endTime = (barber?.schedule[shortDay]).endTime;
   const incrementMinutes = barber.minutesInterval;
   const duration = selectedServices.reduce((acc, curr) => curr.duration * curr.quantity + acc, 0);
   const isGreater = incrementMinutes > duration;

   const lunckBreak = (barber?.schedule[shortDay]).lunchBreak;
   const bookedSlots = appointments
      .filter((app) => app.status !== 'cancelled')
      .filter((a) => a.barber.id === barber?.id)
      .filter((b) => isSameDay(b.date, day.toISOString()))
      .map((appointment) => appointment.startTime);

   // const durationTotal = appointments
   //    .filter((app) => app.status !== 'cancelled')
   //    .filter((a) => a.barber.id === barber?.id)
   //    .filter((b) => isSameDay(b.date, day.toISOString()))
   //    .map((appointment) => appointment.services)
   //    .flat()
   //    .reduce((acc, curr) => curr.duration * curr.quantity + acc, 0);

   const unaivailableTimeSlots = addUnavailableTimeSlots(
      bookedSlots,
      isGreater ? duration : incrementMinutes
   );
   //if (!duration) return;

   const timeSlots = isDayOff
      ? []
      : !barber.isAvailable
        ? []
        : generateAvailableTimeSlots(
             startTime,
             endTime,
             incrementMinutes,
             unaivailableTimeSlots,
             day,
             lunckBreak,
             duration
          );

   const handlePress = (item: TimeSlot, index: number) => {
      handleTimeSelect(item);
      setIndex(index);
   };

   const handleSecondPress = useCallback((item: TimeSlot, index: number) => {
      if (onTilePress) onTilePress(item);
      handleTimeSelect(item);
      setIndex(index);
   }, []);

   const renderTimeSlots: ListRenderItem<TimeSlot> = ({ item, index }) => {
      if (item.isBooked) return null;
      return (
         <TouchableOpacity
            disabled={item.isBooked}
            key={item.time}
            onPress={() =>
               onTilePress ? handleSecondPress(item, index) : handlePress(item, index)
            }
            className={`mx-1 rounded-full px-3 ${item.isBooked ? 'border-2 border-dashed border-slate-200' : ''}  ${selectedTimeSlot?.time === item.time ? 'bg-accent' : changeColor ? 'bg-background' : 'bg-background'}`}>
            <View className=" items-center justify-center">
               <Text
                  className={`py-1 text-center ${selectedTimeSlot?.time === item.time ? 'font-semibold text-white' : 'text-slate-600 dark:text-white'}`}>
                  {item.time}
               </Text>
            </View>
         </TouchableOpacity>
      );
   };

   useEffect(() => {
      if (timeSlots.length === 0) return;
      ref.current?.scrollToIndex({
         index,
         viewOffset: _spacing,
         viewPosition: 0,
         animated: true,
      });
   }, [index, timeSlots.length]);

   if (isDayOff)
      return <Text className="ml-2 text-muted">There is no appoitments available for today.</Text>;

   return (
      <FlatList
         ref={ref}
         showsHorizontalScrollIndicator={false}
         ListEmptyComponent={
            <View className="items-center justify-center gap-5">
               <Text className="ml-3 text-muted">No appointments available</Text>
               <View className="items-center justify-center self-center">
                  <Button
                     title="Book For Another Day"
                     onPress={() => {
                        setSelectedDate(addDays(new Date(), 1));
                        router.push({ pathname: '/booking', params: { barberId: barber.id } });
                     }}
                  />
               </View>
            </View>
         }
         horizontal
         initialScrollIndex={index}
         onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
               ref.current?.scrollToIndex({ index: info.index, animated: true });
            });
         }}
         data={timeSlots}
         renderItem={renderTimeSlots}
      />
   );
};

export default TimeSlotPickerComponent;
