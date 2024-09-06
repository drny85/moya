export function addUnavailableTimeSlots(
   unavailableSlots: string[],
   timeDuration: number // Time to subtract from each slot
): string[] {
   const timeFormat = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${adjustedHours}:${formattedMinutes} ${period}`;
   };

   const newSlots: string[] = [];

   unavailableSlots.forEach((slot) => {
      const [time, period] = slot.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      const originalDate = new Date();
      originalDate.setHours(hours, minutes);

      // Calculate the slot with the subtracted timeDuration
      const subtractedTimeDate = new Date(originalDate.getTime() - timeDuration * 60 * 1000);
      newSlots.push(timeFormat(subtractedTimeDate));

      // Add the original slot to newSlots
      newSlots.push(slot);
   });

   return [...new Set(newSlots)].sort();
}
