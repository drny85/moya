import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {
   format,
   isAfter,
   isSameDay,
   parseISO,
   startOfDay,
   startOfWeek,
   startOfYear,
} from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { Appointment } from '~/shared/types';
import { generateRandomHexColor } from '~/utils/generateRandomHexColor';
import { Text } from './nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

type Segment = 'Today' | 'WTD' | 'YTD' | 'ALL';
const OPTIONS = ['Today', 'WTD', 'YTD', 'ALL'];

interface EarningComponentProps {
   appointments: Appointment[];
}

const EarningComponent: React.FC<EarningComponentProps> = ({ appointments }) => {
   const { isDarkColorScheme } = useColorScheme();
   const [selectedSegment, setSelectedSegment] = useState<Segment>('Today');
   const [earningsData, setEarningsData] = useState<any>({ Today: [], WTD: [], YTD: [], ALL: [] });
   const [detailsData, setDetailsData] = useState<any>({ Today: [], WTD: [], YTD: [], ALL: [] });

   useEffect(() => {
      calculateEarnings();
   }, [appointments]);

   const calculateEarnings = () => {
      const today = startOfDay(new Date());
      const startOfThisWeek = startOfWeek(new Date());
      const startOfThisYear = startOfYear(new Date());

      const earnings = {
         Today: {} as Record<string, number>,
         WTD: {} as Record<string, number>,
         YTD: {} as Record<string, number>,
         ALL: {} as Record<string, number>,
      };

      appointments.forEach((appointment) => {
         const appointmentDate = parseISO(appointment.date);
         const totalEarnings = appointment.services.reduce(
            (sum, service) => sum + service.price * service.quantity,
            0
         );

         if (isSameDay(appointmentDate, today)) {
            const hour = format(appointmentDate, 'ha');
            earnings.Today[hour] = (earnings.Today[hour] || 0) + totalEarnings;
         }

         if (
            isAfter(appointmentDate, startOfThisWeek) ||
            isSameDay(appointmentDate, startOfThisWeek)
         ) {
            const day = format(appointmentDate, 'eee');
            earnings.WTD[day] = (earnings.WTD[day] || 0) + totalEarnings;
         }

         if (
            isAfter(appointmentDate, startOfThisYear) ||
            isSameDay(appointmentDate, startOfThisYear)
         ) {
            const month = format(appointmentDate, 'MMM');
            earnings.YTD[month] = (earnings.YTD[month] || 0) + totalEarnings;
         }

         const year = format(appointmentDate, 'yyyy');
         earnings.ALL[year] = (earnings.ALL[year] || 0) + totalEarnings;
      });

      setEarningsData({
         Today: Object.entries(earnings.Today).map(([label, value]) => ({ label, value })),
         WTD: Object.entries(earnings.WTD).map(([label, value]) => ({ label, value })),
         YTD: Object.entries(earnings.YTD).map(([label, value]) => ({ label, value })),
         ALL: Object.entries(earnings.ALL).map(([label, value]) => ({ label, value })),
      });

      setDetailsData({
         Today: Object.entries(earnings.Today).map(([label, value]) => ({ label, value })),
         WTD: Object.entries(earnings.WTD).map(([label, value]) => ({ label, value })),
         YTD: Object.entries(earnings.YTD).map(([label, value]) => ({ label, value })),
         ALL: Object.entries(earnings.ALL).map(([label, value]) => ({ label, value })),
      });
   };

   const handleSegmentChange = (segment: Segment) => {
      setSelectedSegment(segment);
   };

   const renderDetailItem = ({ item }: { item: { label: string; value: number } }) => (
      <View style={styles.detailItem}>
         <Text style={styles.detailLabel}>{item.label}</Text>
         <Text style={styles.detailValue}>${item.value.toFixed(2)}</Text>
      </View>
   );

   return (
      <View className="flex-1 gap-4 p-2">
         <SegmentedControl
            values={OPTIONS}
            selectedIndex={OPTIONS.indexOf(selectedSegment)}
            onChange={(event) =>
               handleSegmentChange(
                  ['Today', 'WTD', 'YTD', 'ALL'][event.nativeEvent.selectedSegmentIndex] as Segment
               )
            }
         />

         <View className="rounded-md bg-card shadow-sm">
            <BarChart
               data={earningsData[selectedSegment]}
               barWidth={30}
               spacing={20}
               isAnimated
               yAxisLabelPrefix="$"
               adjustToWidth
               barBorderRadius={4}
               //hideRules
               yAxisTextStyle={{
                  color: 'grey',
                  fontSize: 14,
               }}
               xAxisLabelTextStyle={{
                  color: isDarkColorScheme ? '#ffffff' : '#212121',
                  fontSize: 14,
               }}
               frontColor={generateRandomHexColor()}
               yAxisThickness={0}
               xAxisThickness={0}
               noOfSections={5}
            />
         </View>
         <View className="rounded-md bg-card p-2 shadow-sm">
            <Text className="text-center font-raleway-bold text-lg text-muted dark:text-white">
               {selectedSegment}
            </Text>

            <FlatList
               data={detailsData[selectedSegment]}
               ListEmptyComponent={<Text className="text-center text-muted">No Data</Text>}
               renderItem={renderDetailItem}
               keyExtractor={(item) => item.label}
               style={{ marginTop: 10 }}
            />
         </View>
      </View>
   );
};

export default EarningComponent;

const styles = StyleSheet.create({
   detailItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
   },
   detailLabel: {
      fontSize: 16,
      color: '#333',
   },
   detailValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4CAF50',
   },
});
