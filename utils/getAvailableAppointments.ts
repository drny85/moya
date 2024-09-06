import { TimeSlop } from '~/types/typings';

export const getAvailableAppointments = (
   appointments: TimeSlop[],
   timeWindowMinutes: number,
   openTime: string,
   closingTime: string
): TimeSlop[] => {
   const availableAppointments: TimeSlop[] = [];
   let currentStartTime = openTime;
   let id = 0;
   while (currentStartTime <= closingTime) {
      const currentEndTime = addMinutes(currentStartTime, timeWindowMinutes);
      if (
         currentEndTime <= closingTime &&
         isAppointmentAvailable(appointments, currentStartTime, currentEndTime)
      ) {
         const newAppt: TimeSlop = {
            id: ++id,
            startTime: currentStartTime,
            endTime: currentEndTime,
            available: true,
         };

         availableAppointments.push(newAppt);
      }
      currentStartTime = addMinutes(currentStartTime, timeWindowMinutes);
   }

   return availableAppointments;
};

const addMinutes = (time: string, minutes: number): string => {
   const [hourStr, minuteStr] = time.split(':');
   const hour = parseInt(hourStr);
   const minute = parseInt(minuteStr);
   const totalMinutes = hour * 60 + minute + minutes;
   const newHour = Math.floor(totalMinutes / 60) % 24;
   const newMinute = totalMinutes % 60;
   return `${padZero(newHour)}:${padZero(newMinute)}`;
};

const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

const isAppointmentAvailable = (
   appointments: TimeSlop[],
   startTime: string,
   endTime: string
): boolean => {
   const overlappingAppointments = appointments.filter(
      (appt) =>
         (appt.startTime <= startTime && appt.endTime >= startTime) ||
         (appt.startTime <= endTime && appt.endTime >= endTime) ||
         (appt.startTime >= startTime && appt.endTime <= endTime)
   );

   if (overlappingAppointments.length > 0) {
      return false;
   }

   return true;
};
