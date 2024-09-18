import { create } from 'zustand';
import { addNewAppointmentToDatabase, updateAppointmentInDatabase } from '~/actions/appointments';
import { Appointment } from '~/shared/types';

type AppointmentStoreParams = {
   appointments: Appointment[];
   setAppointments: (appointments: Appointment[]) => void;
   addNewAppointment: (appointment: Appointment) => Promise<boolean>;
   getAppointment: (appointmetId: string) => Appointment;
   updateAppointmentsById: (appointmentId: string, appointment: Appointment) => void;
};
export const useAppointmentStore = create<AppointmentStoreParams>((set, get) => ({
   appointments: [],
   updateAppointmentsById: async (appointmentId: string, appointment: Appointment) => {
      let appt: Appointment;
      get().appointments.map((app) => {
         if (app.id === appointmentId) {
            appt = appointment;
            console.log('A', app.startTime);
            return appointment;
         }
         appt = app;

         updateAppointmentInDatabase(appt);
      });
   },

   setAppointments: (appointments: Appointment[]) => set({ appointments }),

   getAppointment: (appointmentId: string) => {
      return get().appointments.find(
         (appointment) => appointment.id === appointmentId
      ) as Appointment;
   },
   addNewAppointment: async (appointment: Appointment) => {
      // set({ appointments: [...get().appointments, appointment] });
      return addNewAppointmentToDatabase(appointment);
   },
}));
