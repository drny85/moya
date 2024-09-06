import { onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { usersCollection } from '~/firebase';
import { useAuth } from '~/providers/AuthContext';

import { AppUser } from '~/shared/types';

export const useAllBarbers = () => {
   const { user } = useAuth();
   const [barbers, setBarbers] = useState<AppUser[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (!user || !user.isBarber) return;
      const barberQuery = query(usersCollection, where('isBarber', '==', true));
      return onSnapshot(barberQuery, (snapshot) => {
         setLoading(true);
         const barbers = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
         setBarbers(barbers);
         setLoading(false);
      });
   }, [user]);

   return { barbers, loading };
};
