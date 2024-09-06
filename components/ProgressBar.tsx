import { StyleSheet, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useColorScheme } from '~/lib/useColorScheme';

const ProgressBar = ({ progress }: { progress: SharedValue<number> }) => {
   const { colors } = useColorScheme();
   const animateView = useAnimatedStyle(() => {
      return {
         width: `${progress.value * 100}%`,
      };
   });

   return (
      <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
         <Animated.View
            style={[styles.progress, { backgroundColor: colors.accent }, animateView]}
         />
      </View>
   );
};

export default ProgressBar;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
   },
   progressBar: {
      width: '100%',
      height: 20,

      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 20,
   },
   progress: {
      height: '100%',
   },
});
