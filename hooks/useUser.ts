import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { usersCollection } from '~/firebase';
import { useAuth } from '~/providers/AuthContext';

export const useUser = () => {
   const { user, setUser } = useAuth();
   useEffect(() => {
      if (!user) {
         setUser(null);
         return;
      }
      const userRef = doc(usersCollection, user?.id);
      return onSnapshot(userRef, (snap) => {
         if (snap.exists()) {
            setUser({ ...snap.data(), id: snap.id });
         }
      });
   }, []);
};
