// DatePicker.tsx
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import React, { useState } from 'react';
import {
   TouchableOpacity,
   Animated,
   Dimensions,
   PanResponder,
   StyleSheet,
   View,
} from 'react-native';

import { Text } from '../nativewindui/Text';

import { generateWeek } from '~/utils/generateWeek';
import { WeekDay } from '~/shared/types';

const { width } = Dimensions.get('window');

type DayProps = {
   date: Date;
   label: string;
   isPast: boolean;
   isSelected: boolean;
   onPress: (day: Date) => void;
};

const Day: React.FC<DayProps> = ({ date, label, isPast, isSelected, onPress }) => (
   <TouchableOpacity
      onPress={() => {
         onPress(date);
      }}
      disabled={isPast}
      className={`flex-1 items-center rounded-lg p-2 shadow-md ${isSelected ? 'bg-accent' : 'bg-white'} ${isPast ? 'opacity-30' : ''}`}>
      <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
         {label.split(' ')[0]}
      </Text>
      <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
         {label.split(' ')[1]}
      </Text>
   </TouchableOpacity>
);

const DatePicker: React.FC = () => {
   const today = new Date();
   const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
      startOfWeek(today, { weekStartsOn: 0 })
   );
   const [selectedDate, setSelectedDate] = useState<Date>(today);
   const [position] = useState(new Animated.Value(0));
   const currentMonthTitle = getMonthTitle(currentWeekStart);
   const weeks = [subDays(currentWeekStart, 7), currentWeekStart, addDays(currentWeekStart, 7)].map(
      (date) => generateWeek(date)
   );

   const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 50,
      onPanResponderMove: Animated.event([null, { dx: position }], { useNativeDriver: false }),
      onPanResponderRelease: (_, { dx }) => {
         if (dx > 50) {
            if (weeks[0][0].date >= today) {
               Animated.spring(position, {
                  toValue: width,
                  useNativeDriver: false,
               }).start(() => {
                  setCurrentWeekStart(subDays(currentWeekStart, 7));
                  position.setValue(0);
               });
            }
         } else if (dx < -50) {
            Animated.spring(position, {
               toValue: -width,
               useNativeDriver: false,
            }).start(() => {
               setCurrentWeekStart(addDays(currentWeekStart, 7));
               position.setValue(0);
            });
         } else {
            Animated.spring(position, {
               toValue: 0,
               useNativeDriver: false,
            }).start();
         }
      },
   });

   return (
      <View style={styles.container}>
         <Text className="py-2 text-center font-roboto-bold">{currentMonthTitle}</Text>
         <Animated.View
            style={[
               styles.weekContainer,
               {
                  transform: [{ translateX: position }],
               },
            ]}
            {...panResponder.panHandlers}>
            {weeks.map((week, weekIndex) => (
               <View key={weekIndex} style={styles.week}>
                  {week.map((day: WeekDay, dayIndex: number) => (
                     <Day
                        key={dayIndex}
                        date={day.date}
                        label={day.label}
                        isPast={day.isPast}
                        isSelected={
                           format(day.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                        }
                        onPress={() => {
                           setSelectedDate(day.date);
                        }}
                     />
                  ))}
               </View>
            ))}
         </Animated.View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      width,
   },
   weekContainer: {
      flexDirection: 'row',
   },
   week: {
      flexDirection: 'row',
      width,
      paddingHorizontal: 4,
   },
   dayContainer: {
      flex: 1,
      alignItems: 'center',
      borderRadius: 10,
   },
   dayText: {
      fontSize: 14,
      color: 'black',
   },

   selectedDayText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: '700',
   },
   pastDay: {
      opacity: 0.5,
   },
});

export default DatePicker;

export const getMonthTitle = (date: Date): string => format(date, 'MMMM yyyy');
