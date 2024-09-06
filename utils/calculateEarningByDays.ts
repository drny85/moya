import { differenceInCalendarWeeks, format, startOfMonth } from 'date-fns';
import { Appointment, dayOrder, Days } from '~/shared/types';
export type EarningsData = {
   day: string;
   value: number;
};
export const getWeekOfMonth = (date: Date): number => {
   const startOfCurrentMonth = startOfMonth(date);

   // Calculate the week number within the current month
   const weekNumber = differenceInCalendarWeeks(date, startOfCurrentMonth, { weekStartsOn: 1 }) + 1;

   return weekNumber;
};
export const calculateEarnings = (
   orders: Appointment[],
   filter: 'Week' | 'Month'
): EarningsData[] => {
   const earningsMap: { [key: string]: number } = {};

   orders.forEach((order) => {
      const orderDate = new Date(order.date);
      let key: string;

      switch (filter) {
         case 'Week':
            key = format(orderDate, 'E');
            break;
         case 'Month':
            const weekNumber = getWeekOfMonth(orderDate);
            key = `Week of ${weekNumber}`;
            break;
         default:
            key = format(orderDate, 'ha');
            break;
      }

      if (!earningsMap[key]) {
         earningsMap[key] = 0;
      }
      if (!order.service.price) return 0;
      earningsMap[key] += order.service.price;
   });

   console.log(earningsMap);

   const sortedEarnings = Object.keys(earningsMap)
      .map((key) => ({
         day: key,
         value: earningsMap[key],
      }))
      .sort((a, b) => {
         if (filter === 'Week')
            return dayOrder.indexOf(a.day as Days) - dayOrder.indexOf(b.day as Days);
         return a.day.localeCompare(b.day);
      });

   return sortedEarnings;
};
