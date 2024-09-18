import { useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '~/providers/AuthContext';

export function useProtectedRoute() {
   const segments = useSegments();
   const router = useRouter();
   const [mounted, setMounted] = useState(false);
   const { loading, user } = useAuth();

   useEffect(() => {
      setMounted(true);
   }, [loading]);

   useEffect(() => {
      if (!mounted) return;

      const inAuthGroup = segments[1] === '(auth)';
      const inBarberGroup = segments[1] === '(barber-tabs)';
      const inUserGroup = segments[1] === '(tabs)';

      // Redirect non-signed-in users trying to access protected routes
      if (user && inAuthGroup && !user.isBarber) {
         // Redirect signed-in non-barber users away from the sign-in page
         router.replace('/(tabs)');
      } else if (user && inAuthGroup && user.isBarber) {
         router.replace('/(barber-tabs)');
      } else if (user && inBarberGroup && !user.isBarber) {
         router.replace('/(tabs)');
      } else if (user && inUserGroup && user.isBarber) {
         router.replace('/(barber-tabs)');
      }
   }, [user, segments, mounted]);

   return { mounted };
}
