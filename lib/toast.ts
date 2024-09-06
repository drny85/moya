import * as Burnt from 'burnt';
import { SFSymbol } from 'expo-symbols';

import { COLORS } from '~/theme/colors';

export type IconParams = {
   ios: {
      /**
       * The name of an iOS-only SF Symbol. For a full list, see https://developer.apple.com/sf-symbols/.
       * @platform ios
       */
      name: SFSymbol | (string & object);
      /**
       * Change the custom icon color, default is system blue.
       * @platform ios
       */
      color: string;
   };
   web?: JSX.Element;
};
type Props = {
   title: string;
   message: string;
   position?: 'top' | 'bottom';
   preset?: 'error' | 'done' | 'custom' | 'none';
   duration?: number;
   shouldDismissByDrag?: boolean;
   haptic?: 'success' | 'error' | 'warning' | 'none';
   iconName?: IconParams['ios']['name'];
};
export const toastMessage = ({
   title,
   message,
   position,
   duration = 3,
   shouldDismissByDrag = true,
   haptic = 'none',
   preset = 'done',
   iconName,
}: Props) => {
   Burnt.toast({
      duration,
      from: position,
      message,
      title,
      haptic,
      shouldDismissByDrag,
      preset,
      icon: {
         ios: {
            name: iconName!,
            color: COLORS.light.ascent,
         },
      },
   });
};
type AlertProps = {
   title: string;
   message: string;
   duration?: number;
   haptic?: 'success' | 'error' | 'warning' | 'none';
   preset?: 'done' | 'custom' | 'none' | 'error' | 'heart' | 'spinner';
   iconName?: IconParams['ios']['name'];
};
export const toastAlert = ({ title, message, duration = 3, preset, iconName }: AlertProps) => {
   Burnt.alert({
      title,
      message,
      duration,
      shouldDismissByTap: true,
      preset,
      icon: {
         ios: {
            name: iconName!,
            color: COLORS.light.card,
         },
      },
   });
};
