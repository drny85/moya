import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { usersCollection } from '~/firebase';
import { AppUser } from '~/shared/types';

export const updateUser = async (user: AppUser): Promise<boolean> => {
   try {
      if (!user) return false;
      const userDoc = doc(usersCollection, user.id);
      const userData = await getDoc(userDoc);
      if (!userData.exists()) return false;

      await updateDoc(userDoc, { ...user });
      return true;
   } catch (error) {
      console.log('Error updating user', error);
      return false;
   }
};
