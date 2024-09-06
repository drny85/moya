import React from 'react';
import { Text, View } from 'react-native';

import { DatePicker } from './nativewindui/DatePicker';
import { Toggle } from './nativewindui/Toggle';
import { ScheduleDay } from '~/shared/types';

interface DayScheduleRowProps {
   day: string;
   schedule: ScheduleDay;
   onUpdate: (
      day: string,
      field: keyof ScheduleDay | 'lunchBreakStart' | 'lunchBreakEnd',
      value: string | boolean
   ) => void;
}

const DayScheduleRow: React.FC<DayScheduleRowProps> = ({ day, schedule, onUpdate }) => {
   const handleTimeChange = (
      event: any,
      selectedDate: Date | undefined,
      field: keyof ScheduleDay | 'lunchBreakStart' | 'lunchBreakEnd'
   ) => {
      if (selectedDate) {
         const timeString = formatTime12Hour(selectedDate.getHours(), selectedDate.getMinutes());
         onUpdate(day, field, timeString);
      }
   };

   const parseTime12Hour = (time: string): [number, number] => {
      const [timePart, period] = time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);

      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return [hours, minutes];
   };
   const parseTime12HourA = (time: string): string => {
      const [timePart, period] = time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);

      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return `${hours}:${minutes.toString() === '0' ? '00' : minutes}`;
   };

   const formatTime12Hour = (hours: number, minutes: number): string => {
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour format
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${formattedHours}:${formattedMinutes} ${period}`;
   };

   return (
      <View className="my-1 w-full flex-row items-center bg-card p-2 shadow-sm">
         <Text className="mr-2 text-lg font-semibold">{day}</Text>
         <Toggle value={schedule.isOff} onValueChange={(value) => onUpdate(day, 'isOff', value)} />
         {!schedule.isOff && (
            <View className="flex-grow items-center gap-2">
               <View className="flex-row gap-3">
                  <View>
                     <Text className="mb-1 text-center text-muted">Start</Text>
                     <DatePicker
                        value={new Date(`1970-01-01T${parseTime12HourA(schedule.startTime)}`)}
                        mode="time"
                        display="default"
                        style={{ width: 90, height: 30 }}
                        minuteInterval={15}
                        is24Hour={false}
                        onChange={(event, selectedDate) =>
                           handleTimeChange(event, selectedDate, 'startTime')
                        }
                     />
                  </View>
                  <View>
                     <Text className="mb-1 text-center text-muted">End</Text>
                     <DatePicker
                        value={new Date(`1970-01-01T${parseTime12HourA(schedule.endTime)}`)}
                        mode="time"
                        display="default"
                        minuteInterval={15}
                        style={{ width: 90, height: 30 }}
                        is24Hour={false}
                        onChange={(event, selectedDate) =>
                           handleTimeChange(event, selectedDate, 'endTime')
                        }
                     />
                  </View>
               </View>
               <Text className="text-center text-muted">Lunch Break</Text>

               <View className="flex-row gap-3">
                  <DatePicker
                     value={new Date(`1970-01-01T${parseTime12HourA(schedule.lunchBreak.start)}`)}
                     mode="time"
                     display="default"
                     minuteInterval={15}
                     style={{ width: 90, height: 30 }}
                     is24Hour={false}
                     onChange={(event, selectedDate) => {
                        handleTimeChange(event, selectedDate, 'lunchBreakStart');
                     }}
                  />

                  <DatePicker
                     value={new Date(`1970-01-01T${parseTime12HourA(schedule.lunchBreak?.end)}`)}
                     mode="time"
                     display="default"
                     minuteInterval={15}
                     style={{ width: 90, height: 30 }}
                     is24Hour={false}
                     onChange={(event, selectedDate) => {
                        handleTimeChange(event, selectedDate, 'lunchBreakEnd');
                     }}
                  />
               </View>
            </View>
         )}
      </View>
   );
};

export default DayScheduleRow;
