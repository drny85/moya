import { Appointment } from '~/shared/types';

type FilterType = 'today' | 'weekToDate' | 'monthToDate';

export function calculateEarningsByFilter(
   appointments: Appointment[],
   filter: FilterType,
   status: Appointment['status']
): number {
   const today = new Date();
   let startDate: Date;

   switch (filter) {
      case 'today':
         startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
         break;
      case 'weekToDate':
         startDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - today.getDay()
         );
         break;
      case 'monthToDate':
         startDate = new Date(today.getFullYear(), today.getMonth(), 1);
         break;
      default:
         throw new Error('Invalid filter type');
   }

   return appointments
      .filter((appointment) => {
         const appointmentDate = new Date(appointment.date);
         return appointment.status === status && appointmentDate >= startDate;
      })
      .reduce((total, appointment) => {
         const serviceEarnings = appointment.services.reduce((serviceTotal, service) => {
            return serviceTotal + service.price * service.quantity;
         }, 0);
         return total + serviceEarnings;
      }, 0);
}
