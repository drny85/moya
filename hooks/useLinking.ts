import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

export const useLinking = () => {
   const router = useRouter();

   useEffect(() => {
      const handleDeepLink = async (event: { url: string }) => {
         try {
            const initialUrl = await Linking.getInitialURL();
            console.log('initialUrl', initialUrl);
            //if (!initialUrl) return;
            const data = Linking.parse(event.url);
            console.log('URL', event.url);
            // Handle deep link data
            console.log('deepLinks Data', JSON.stringify(data, null, 2));
            if (data.hostname === 'barber' && data.queryParams?.barberId) {
               router.push({
                  pathname: '/barber',
                  params: { barberId: data.queryParams.barberId },
               });
            } else if (data.hostname === 'moya-site.vercel.app' && data.queryParams?.linking) {
               router.push({
                  pathname: '/barber',
                  params: { barberId: (data.queryParams.linking as string).split('=')[1] },
               });
            } else {
               console.log('Unhandled deep link');
            }
         } catch (error) {
            console.error('Error handling deep link:', error);
         }
      };

      const listener = Linking.addEventListener('url', handleDeepLink);

      return () => {
         listener.remove();
      };
   }, []);
};
