import { onSnapshot, query, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { usersCollection } from '~/firebase';
import { useBarbersStore } from '~/providers/useBarbersStore';
import { Barber } from '~/shared/types';

export const useBarbers = () => {
   const setBarbers = useBarbersStore((s) => s.setBarbers);
   useEffect(() => {
      const barberQuery = query(
         usersCollection,
         where('isActive', '==', true),
         where('isBarber', '==', true)
      );
      return onSnapshot(barberQuery, (snapshot) => {
         const barbers = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
         setBarbers(barbers as Barber[]);
      });
   }, []);
};
