import { ScrollView, View } from 'react-native';
import TimeSlotPickerComponent from './TimeSlotsPicker';
import WeekSelector from './WeekSelectorComponent';
import { Button } from '../Button';
import { Text } from '../nativewindui/Text';

import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore';
import { Barber } from '~/shared/types';

type Props = {
   onPress: () => void;
   barber: Barber;
};
const DateTimeAppointmentPicker = ({ onPress, barber }: Props) => {
   const { selectedDate, selectedTimeSlot } = useAppointmentFlowStore();

   return (
      <View className="bg-card">
         <ScrollView contentContainerClassName="gap-3 p-2 mt-3 bg-card">
            <View>
               <Text className="mb-1 ml-2 text-lg font-semibold text-slate-600">Date</Text>
               <WeekSelector schedule={barber.schedule} />
            </View>

            <View className="mt-3">
               <Text variant="subhead" className="mb-1 ml-2 text-lg font-semibold text-slate-600">
                  Time
               </Text>
               <TimeSlotPickerComponent barber={barber} />
            </View>
         </ScrollView>
         <View className="mx-4">
            <Button
               iconName="save"
               style={{ paddingHorizontal: 20 }}
               title="Save Appointment"
               disabled={!selectedDate || !selectedTimeSlot}
               onPress={onPress}
            />
         </View>
      </View>
   );
};

export default DateTimeAppointmentPicker;
