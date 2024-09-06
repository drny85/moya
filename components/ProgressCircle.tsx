import * as React from 'react';
import { Easing, TextInput, Animated, View, StyleSheet, ColorValue } from 'react-native';

import Svg, { G, Circle } from 'react-native-svg';
import { SIZES } from '~/constants';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
type Props = {
   percentage: number;
   radius?: number;
   strokeWidth?: number;
   duration?: number;
   color?: ColorValue;
   textColor?: ColorValue;
   max?: number;
};
const ProgressCircle = ({
   percentage,
   radius = (SIZES.width * 0.25) / 2,
   strokeWidth = 10,
   duration = 500,
   color,
   textColor,
   max = 100,
}: Props) => {
   const animated = React.useRef(new Animated.Value(0)).current;
   const circleRef = React.useRef<Circle>(null);
   const inputRef = React.useRef<TextInput>(null);
   const circumference = 2 * Math.PI * radius;
   const halfCircle = radius + strokeWidth;

   const animation = (toValue: number) => {
      console.log('Value', toValue);
      if (isFinite(toValue)) return;
      return Animated.timing(animated, {
         delay: 600,
         toValue: toValue || 0,
         duration,
         useNativeDriver: true,
         easing: Easing.out(Easing.ease),
      }).start();
   };

   React.useEffect(() => {
      animation(percentage);
      console.log(isNaN(percentage), isFinite(percentage));

      animated.addListener(
         (v) => {
            const maxPerc = (100 * (v.value >= 100 ? 100 : v.value)) / max;
            const g = circumference - (circumference * maxPerc) / 100;
            const strokeDashoffset = g;

            if (inputRef?.current) {
               inputRef.current.setNativeProps({
                  text: `${Math.round(v.value)}%`,
               });
            }
            if (circleRef?.current) {
               circleRef.current.setNativeProps({
                  //@ts-ignore
                  strokeDashoffset,
               });
            }
         },
         //@ts-ignore
         [percentage, max]
      );

      return () => {
         animated.removeAllListeners();
      };
   }, [percentage]);

   return (
      <View style={{ width: radius * 2, height: radius * 2 }}>
         <Svg
            height={radius * 2}
            width={radius * 2}
            viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
            <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
               <Circle
                  ref={circleRef}
                  cx="50%"
                  cy="50%"
                  r={radius}
                  fill="transparent"
                  stroke={color || 'red'}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDashoffset={circumference}
                  strokeDasharray={circumference}
               />
               <Circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  fill="transparent"
                  stroke={color || 'blue'}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeOpacity=".1"
               />
            </G>
         </Svg>
         <AnimatedTextInput
            ref={inputRef}
            underlineColorAndroid="transparent"
            editable={false}
            defaultValue="0"
            style={[
               StyleSheet.absoluteFillObject,
               { fontSize: radius / 3, color: textColor ?? color },
               styles.text,
            ]}
         />
      </View>
   );
};

export default ProgressCircle;

const styles = StyleSheet.create({
   text: { textAlign: 'center', fontFamily: 'SFBold' },
});
