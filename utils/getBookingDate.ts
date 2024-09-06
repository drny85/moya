export const getBookingDate = (date: Date, timeString: string): Date => {
   // Check if the date object is valid
   if (isNaN(date.getTime())) {
      throw new Error('Invalid date object');
   }
   // Parse the time string to extract hours, minutes, and period (AM/PM)
   const [timePart, period] = timeString.split(' ');
   const [hours, minutes] = timePart.split(':').map(Number);

   // Validate hours and minutes
   if (isNaN(hours) || isNaN(minutes) || hours < 1 || hours > 12 || minutes < 0 || minutes >= 60) {
      throw new Error('Invalid time string');
   }

   // Adjust hours based on the period (AM/PM)
   let adjustedHours = hours;
   if (period === 'PM' && hours !== 12) {
      adjustedHours += 12;
   } else if (period === 'AM' && hours === 12) {
      adjustedHours = 0;
   }

   // Create a new Date object based on the provided date
   const combinedDate = new Date(date);

   // Set the hours and minutes on the new Date object
   combinedDate.setHours(adjustedHours, minutes, 0, 0);

   return combinedDate;
};
