// utils.ts
export const getNextDays = (numDays: number = 6): string[] => {
   const dates: string[] = [];
   const today = new Date();

   for (let i = 0; i < numDays; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      dates.push(nextDay.toISOString().split('T')[0]); // Format: 'YYYY-MM-DD'
   }

   return dates;
};
