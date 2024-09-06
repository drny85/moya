import { addDoc } from 'firebase/firestore';
import { reviewsCollection } from '~/firebase';
import { Review } from '~/shared/types';

export const addNewReview = async (review: Review): Promise<boolean> => {
   try {
      if (!review) return false;

      await addDoc(reviewsCollection, { ...review });
      return true;
   } catch (error) {
      console.log(error);
      return false;
   }
};
