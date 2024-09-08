import { Keyboard, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useColorScheme } from '~/lib/useColorScheme';

const PADDING = 20;

type Props = {
   children: React.ReactNode;
   style?: ViewStyle;
};
const KeyboardScreen = ({ children, style }: Props) => {
   const { height } = useGradualAnimation();
   const { colors, colorScheme } = useColorScheme();
   console.log('colorScheme', colorScheme);
   const animatedStyle = useAnimatedStyle(() => {
      return {
         height: Math.abs(height.value),
         marginBottom: height.value > 0 ? 0 : PADDING,
      };
   });
   return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         <View style={[{ flex: 1, backgroundColor: colors.background }, style]}>
            {children}
            <Animated.View style={animatedStyle} />
         </View>
      </TouchableWithoutFeedback>
   );
};

export default KeyboardScreen;

const useGradualAnimation = () => {
   const height = useSharedValue(PADDING);
   useKeyboardHandler(
      {
         onMove: (e) => {
            'worklet';

            height.value = Math.max(PADDING, e.height);
         },
         onEnd: (e) => {
            'worklet';

            height.value = e.height;
         },
      },
      []
   );

   return { height };
};
