import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { StyleSheet, View } from 'react-native';
import { SIZES } from '~/constants';
import { useColorScheme } from '~/lib/useColorScheme';

export default function BarbersSkelenton() {
   const { colors, colorScheme } = useColorScheme();

   return (
      <MotiView
         transition={{
            duration: 1000,
         }}
         style={[styles.container, styles.padded, { backgroundColor: colors.background }]}
         animate={{ backgroundColor: colors.card }}>
         {/* <View className="flex-row items-center justify-between">
            <Skeleton colorMode={colorScheme} width={SIZES.width * 0.6} height={40} radius={6} />
            <Skeleton colorMode={colorScheme} width={SIZES.width * 0.3} height={40} radius={30} />
         </View>
         <Spacer height={20} />
         <Skeleton colorMode={colorScheme} width={SIZES.width * 0.9} radius={30} height={40} />
         <Spacer height={20} /> */}
         <View style={{ gap: 10 }}>
            {[...Array(5)].map((_, index) => (
               <Skeleton
                  key={index}
                  colorMode={colorScheme}
                  width={'100%'}
                  height={SIZES.height * 0.24}
                  radius={30}
               />
            ))}
         </View>
         {/* <Spacer height={20} />
         <View style={{ gap: 12 }}>
            {[...Array(3)].map((_, index) => (
               <Skeleton
                  key={index}
                  colorMode={colorScheme}
                  width={'100%'}
                  height={SIZES.height * 0.2}
               />
            ))}
         </View> */}
      </MotiView>
   );
}

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
   },
   padded: {
      padding: 10,
   },
});
