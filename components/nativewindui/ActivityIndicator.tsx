import { ActivityIndicator as RNActivityIndicator, View } from 'react-native';

import { useColorScheme } from '~/lib/useColorScheme';

export function ActivityIndicator(
   props: React.ComponentPropsWithoutRef<typeof RNActivityIndicator>
) {
   const { colors } = useColorScheme();
   return (
      <View className="flex-1 items-center justify-center bg-background">
         <RNActivityIndicator color={colors.primary} {...props} />
      </View>
   );
}
