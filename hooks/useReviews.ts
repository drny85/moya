import { getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { reviewsCollection } from '~/firebase';
import { Review } from '~/shared/types';

export const useReviews = () => {
   const [reviews, setReviews] = useState<Review[]>([]);
   const [loading, setLoading] = useState(false);

   const getReviews = async () => {
      try {
         setLoading(true);
         const response = await getDocs(reviewsCollection);
         const data = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
         setReviews(data as Review[]);
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };
   useEffect(() => {
      getReviews();
   }, []);

   return {
      reviews,
      loading,
   };
};
