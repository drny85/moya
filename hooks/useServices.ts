import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { servicesCollection } from '~/firebase';
import { Service } from '~/shared/types';

export const useServices = (barberId: string) => {
   const [services, setServices] = useState<Service[]>([]);
   const [loading, setLoading] = useState(false);
   useEffect(() => {
      setLoading(true);
      return onSnapshot(servicesCollection(barberId), (snapshot) => {
         const services = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setServices(services as Service[]);
         setLoading(false);
      });
   }, [barberId]);

   return { services, loading };
};
