import { addMinutes, isBefore, isSameDay, isPast } from 'date-fns';
import { Appointment } from '~/shared/types';

export const appointmentsConflict = (
   appointments: Appointment[],
   appointmentDate: string,
   duration: number,
   userId: string
) =>
   appointments
      .filter(
         (a) =>
            isSameDay(a.date, appointmentDate) &&
            !isPast(a.date) &&
            a.customer.id === userId &&
            a.status !== 'completed'
      )
      .some((app) => isBefore(app.date, addMinutes(appointmentDate, duration)));
