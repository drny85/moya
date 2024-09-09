import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { usersCollection } from '~/firebase';
import { Barber } from '~/shared/types';

export const useBarber = (barberId?: string) => {
   const [loading, setLoading] = useState(false);
   const [barber, setBarber] = useState<Barber | null>(null);
   useEffect(() => {
      if (!barberId) return;
      const docRef = doc(usersCollection, barberId);
      setLoading(true);
      return onSnapshot(docRef, (snap) => {
         console.log(snap.exists());

         setBarber({ id: snap.id, ...snap.data() } as Barber);
         setLoading(false);
      });
   }, [barberId]);

   return { barber, loading };
};
