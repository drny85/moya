import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { servicesCollection } from '~/firebase';
import { Service } from '~/shared/types';

export const addNewService = async (barberId: string, service: Service): Promise<boolean> => {
   try {
      if (!barberId || !service) return false;
      const serviceRef = doc(servicesCollection(barberId));
      await setDoc(serviceRef, service);
      return true;
   } catch (error) {
      console.log(error);
      return false;
   }
};

export const updateService = async (barberId: string, service: Service): Promise<boolean> => {
   try {
      if (!barberId || !service) return false;
      const serviceRef = doc(servicesCollection(barberId), service.id);
      await updateDoc(serviceRef, service);
      return true;
   } catch (error) {
      console.log(error);
      return false;
   }
};
