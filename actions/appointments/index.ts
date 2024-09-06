import { addDoc, doc, updateDoc } from 'firebase/firestore';
import { appointmentsCollection } from '~/firebase';
import { Appointment } from '~/shared/types';

export const addNewAppointmentToDatabase = async (appointment: Appointment): Promise<boolean> => {
   try {
      await addDoc(appointmentsCollection, { ...appointment });
      return true;
   } catch (error) {
      console.log('Error adding new appointment', error);
      return false;
   }
};

export const updateAppointmentInDatabase = async (appointment: Appointment): Promise<boolean> => {
   try {
      const appointmentRef = doc(appointmentsCollection, appointment.id);
      console.log('appointment ID', appointment.id);
      await updateDoc(appointmentRef, { ...appointment });
      return true;
   } catch (error) {
      console.log('Error updating appointment', error);
      return false;
   }
};
