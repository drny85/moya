import { TextInput, Animated, Easing, TextStyle } from 'react-native';
import React, { useEffect } from 'react';
import { useColorScheme } from '~/lib/useColorScheme';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type Props = {
   value: number;
   textStyle?: TextStyle;
};
const AnimatedNumber = ({ value, textStyle }: Props) => {
   const inputRef = React.useRef<TextInput>(null);
   const animated = React.useRef(new Animated.Value(0)).current;
   const { colors } = useColorScheme();
   const animation = (toValue: number) => {
      return Animated.timing(animated, {
         delay: 200,
         toValue: toValue,
         duration: 500,
         useNativeDriver: true,
         easing: Easing.out(Easing.ease),
      }).start();
   };

   useEffect(() => {
      animation(value);
      animated.addListener(({ value }) => {
         if (inputRef.current) {
            inputRef.current.setNativeProps({ text: `$${value.toFixed(2)}` });
         }
      });
      return () => {
         animated.removeAllListeners();
      };
   }, [value]);

   return (
      <AnimatedTextInput
         ref={inputRef}
         underlineColorAndroid="transparent"
         editable={false}
         defaultValue="0"
         style={[{ fontSize: 20, color: colors.accent }, textStyle]}
      />
   );
};

export default AnimatedNumber;
