// utils.ts
import { addDays, format, startOfWeek, subDays } from 'date-fns';

import { WeekDay } from '~/types/typings';

export const generateWeek = (referenceDate: Date): WeekDay[] => {
   const startOfWeekDate = startOfWeek(referenceDate, { weekStartsOn: 0 }); // Week starts on Sunday
   const today = new Date();

   return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(startOfWeekDate, index);
      return {
         date,
         label: format(date, 'E dd'),
         isPast: date < today && format(date, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd'),
      };
   });
};
