import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { Button } from './Button';
import { Text } from './nativewindui/Text';
import DayScheduleRow from './ScheduleChange';
import { Feather } from '@expo/vector-icons';
import { dayOrder, Days, Schedule, ScheduleDay } from '~/shared/types';

const ScheduleEditor: React.FC<{
   schedule: Schedule;
   onPressSave: (newSchedule: Schedule) => void;
   onCancel: () => void;
}> = ({ schedule, onPressSave, onCancel }) => {
   const [currentSchedule, setCurrentSchedule] = useState<Schedule>(schedule);

   const handleUpdate = (
      day: Days,
      field: keyof ScheduleDay | 'lunchBreakStart' | 'lunchBreakEnd',
      value: string | boolean
   ) => {
      setCurrentSchedule((prevSchedule) => {
         const updatedDaySchedule = { ...prevSchedule[day] };

         if (field === 'lunchBreakStart') {
            updatedDaySchedule.lunchBreak = {
               ...updatedDaySchedule.lunchBreak,
               start: value as string,
            };
         } else if (field === 'lunchBreakEnd') {
            updatedDaySchedule.lunchBreak = {
               ...updatedDaySchedule.lunchBreak,
               end: value as string,
            };
         } else if (field === 'isOff') {
            updatedDaySchedule.isOff = value as boolean;
            if (value) {
               //@ts-ignore
               delete updatedDaySchedule.startTime;
               //@ts-ignore
               delete updatedDaySchedule.endTime;
               //@ts-ignore
               delete updatedDaySchedule.lunchBreak;
            } else {
               updatedDaySchedule.startTime = '09:00';
               updatedDaySchedule.endTime = '17:00';
               updatedDaySchedule.lunchBreak = { start: '12:00', end: '13:00' };
            }
         } else {
            //@ts-ignore
            updatedDaySchedule[field] = value as string;
         }

         return {
            ...prevSchedule,
            [day]: updatedDaySchedule,
         };
      });
   };

   const handleSave = () => {
      onPressSave(currentSchedule);

      // You can handle saving the updated schedule here
   };

   return (
      <View className="flex-1">
         <View className="mb-1 flex-row items-center justify-between px-2">
            <TouchableOpacity onPress={onCancel}>
               <Feather name="chevron-left" size={28} color={'#212121'} />
            </TouchableOpacity>
            <Text className="mb-2 text-center" variant={'title2'}>
               My Schedule
            </Text>
            <Button
               iconName="save"
               title="Save"
               onPress={handleSave}
               style={{ paddingVertical: 6 }}
            />
         </View>
         <ScrollView contentContainerClassName="p-2 mb-3" showsVerticalScrollIndicator={false}>
            {Object.keys(currentSchedule)
               .sort((a, b) => dayOrder.indexOf(a as Days) - dayOrder.indexOf(b as Days))
               .map((day) => (
                  <DayScheduleRow
                     key={day}
                     day={day}
                     schedule={currentSchedule[day as Days]}
                     // @ts-ignore
                     onUpdate={handleUpdate}
                  />
               ))}
         </ScrollView>
      </View>
   );
};

export default ScheduleEditor;
