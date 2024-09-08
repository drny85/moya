import { Switch } from 'react-native';

import { useColorScheme } from '~/lib/useColorScheme';
import { COLORS } from '~/theme/colors';

export function Toggle(props: React.ComponentPropsWithoutRef<typeof Switch>) {
   const { colors } = useColorScheme();
   return (
      <Switch
         trackColor={{
            true: colors.accent,
            false: colors.grey,
         }}
         thumbColor={colors.primary}
         {...props}
      />
   );
}
