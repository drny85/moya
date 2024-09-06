import * as Linking from 'expo-linking';
import { Share } from 'react-native';
import { SITE_URL } from '~/constants';
export const shareBarberLink = async (barberId: string) => {
   if (!barberId) return;
   try {
      const url = Linking.createURL('barber', {
         queryParams: { barberId },
      });
      console.log(url);

      const websiteUrl = `${SITE_URL}/barbers?linking=${url}`;
      console.log(websiteUrl);
      const share = await Share.share(
         {
            title: 'Share URL',
            message: `Check out this barber\n${websiteUrl}`,
            url: url,
         },
         {
            dialogTitle: 'Share URL',
         }
      );
      if (share.action === Share.sharedAction) {
         if (share.activityType) {
            // shared with activity type of share.activityType
         }
      }
   } catch (error) {
      console.log(error);
   }
};
