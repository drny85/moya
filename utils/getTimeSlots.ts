type LunchBreak = {
   start: string;
   end: string;
};

type TimeSlot = {
   time: string;
   isBooked: boolean;
};

export const generateAvailableTimeSlots = (
   startTime: string,
   endTime: string,
   incrementMinutes: number,
   bookedSlots: string[],
   currentDate: Date,
   lunchBreak: LunchBreak,
   duration: number
): TimeSlot[] => {
   const slots: TimeSlot[] = [];
   const now = new Date();

   const isToday = currentDate.toDateString() === now.toDateString();

   // Parse startTime and endTime into 24-hour format
   const [startHoursDefault, startMinutesDefault] = parseTime12Hour(startTime);
   const [endHours, endMinutes] = parseTime12Hour(endTime);

   // Parse lunchBreak times in 24-hour format
   const [lunchStartHours, lunchStartMinutes] = parseTime12Hour(lunchBreak.start);
   const [lunchEndHours, lunchEndMinutes] = parseTime12Hour(lunchBreak.end);

   // Initialize startHours and startMinutes with default start time
   let startHours = startHoursDefault;
   let startMinutes = startMinutesDefault;

   // Adjust startHours and startMinutes if today and current time is after the startTime
   if (
      isToday &&
      (now.getHours() > startHoursDefault ||
         (now.getHours() === startHoursDefault && now.getMinutes() > startMinutesDefault))
   ) {
      startHours = now.getHours();
      startMinutes = now.getMinutes();

      // Adjust startMinutes to the next increment if needed
      if (startMinutes % incrementMinutes !== 0) {
         startMinutes = Math.ceil(startMinutes / incrementMinutes) * incrementMinutes;
         if (startMinutes >= 60) {
            startMinutes %= 60;
            startHours += 1;
         }
      }
   }

   // Calculate the latest start time for a slot to finish within endTime
   const [latestSlotHours, latestSlotMinutes] = calculateLatestSlot(endHours, endMinutes, duration);

   // Sort bookedSlots by time
   bookedSlots.sort(
      (a, b) =>
         parseTime12Hour(a)[0] * 60 +
         parseTime12Hour(a)[1] -
         parseTime12Hour(b)[0] * 60 -
         parseTime12Hour(b)[1]
   );

   let currentSlotIndex = 0;
   let currentBookedSlot =
      bookedSlots.length > 0 ? parseTime12Hour(bookedSlots[currentSlotIndex]) : null;

   while (
      (startHours < latestSlotHours ||
         (startHours === latestSlotHours && startMinutes <= latestSlotMinutes)) &&
      (startHours > startHoursDefault ||
         (startHours === startHoursDefault && startMinutes >= startMinutesDefault))
   ) {
      if (
         !isToday ||
         startHours > now.getHours() ||
         (startHours === now.getHours() && startMinutes >= now.getMinutes())
      ) {
         const timeSlot = formatTime12Hour(startHours, startMinutes);

         const isDuringLunchBreak =
            (startHours < lunchEndHours ||
               (startHours === lunchEndHours && startMinutes < lunchEndMinutes)) &&
            (startHours > lunchStartHours ||
               (startHours === lunchStartHours && startMinutes >= lunchStartMinutes));

         let isBookedSlot = false;
         if (currentBookedSlot) {
            const [bookedHours, bookedMinutes] = currentBookedSlot;
            const bookedSlotEnd = addMinutes(
               //@ts-ignore
               new Date().setHours(bookedHours, bookedMinutes),
               duration
            );

            const nextBookedSlotStart = addMinutes(bookedSlotEnd, incrementMinutes);

            if (
               startHours * 60 + startMinutes >= bookedHours * 60 + bookedMinutes &&
               startHours * 60 + startMinutes <
                  nextBookedSlotStart.getHours() * 60 + nextBookedSlotStart.getMinutes()
            ) {
               isBookedSlot = true;
            } else if (
               startHours * 60 + startMinutes >=
               nextBookedSlotStart.getHours() * 60 + nextBookedSlotStart.getMinutes()
            ) {
               currentSlotIndex++;
               currentBookedSlot = bookedSlots[currentSlotIndex]
                  ? parseTime12Hour(bookedSlots[currentSlotIndex])
                  : null;
            }
         }

         if (!isDuringLunchBreak && !isBookedSlot) {
            slots.push({ time: timeSlot, isBooked: false });
         } else {
            slots.push({ time: timeSlot, isBooked: true });
         }
      }
      startMinutes += incrementMinutes;
      if (startMinutes >= 60) {
         startMinutes %= 60;
         startHours += 1;
      }
   }

   return slots;
};

// Helper function to calculate the latest start time for a slot to finish within endTime
const calculateLatestSlot = (
   endHours: number,
   endMinutes: number,
   duration: number
): [number, number] => {
   let latestSlotHours = endHours;
   let latestSlotMinutes = endMinutes - duration;
   if (latestSlotMinutes < 0) {
      latestSlotMinutes += 60;
      latestSlotHours -= 1;
   }
   return [latestSlotHours, latestSlotMinutes];
};

// Helper function to parse time in 12-hour format (e.g., "2:30 PM") into 24-hour format numbers
const parseTime12Hour = (time: string): [number, number] => {
   const [timePart, period] = time.split(' ');
   let [hours, minutes] = timePart.split(':').map(Number);

   if (period === 'PM' && hours < 12) hours += 12;
   if (period === 'AM' && hours === 12) hours = 0;

   return [hours, minutes];
};

// Helper function to format time as 12-hour clock with AM/PM
const formatTime12Hour = (hours: number, minutes: number): string => {
   const period = hours >= 12 ? 'PM' : 'AM';
   const formattedHours = hours % 12 || 12;
   const formattedMinutes = minutes.toString().padStart(2, '0');
   return `${formattedHours}:${formattedMinutes} ${period}`;
};

// Helper function to add minutes to a Date object and return a new Date object
const addMinutes = (date: Date, minutes: number): Date => {
   const newDate = new Date(date);
   newDate.setMinutes(newDate.getMinutes() + minutes);
   return newDate;
};
