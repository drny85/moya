import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StepperProps {
   step?: number;
   minValue?: number;
   maxValue?: number;
   initialValue?: number;
   onValueChange?: (value: number) => void;
}

const Stepper: React.FC<StepperProps> = ({
   step = 1,
   minValue = 0,
   maxValue = 100,
   initialValue = 0,
   onValueChange,
}) => {
   const [value, setValue] = useState(initialValue);

   const increment = () => {
      if (value + step <= maxValue) {
         const newValue = value + step;
         setValue(newValue);
         onValueChange?.(newValue);
      }
   };

   const decrement = () => {
      if (value - step >= minValue) {
         const newValue = value - step;
         setValue(newValue);
         onValueChange?.(newValue);
      }
   };

   return (
      <View className="flex-row items-center gap-2">
         <TouchableOpacity
            onPress={decrement}
            className="h-12 w-12 items-center justify-center rounded-full bg-card  shadow-sm">
            <Text className="text-2xl font-bold">-</Text>
         </TouchableOpacity>
         <Text className="text-lg font-semibold">{value}</Text>
         <TouchableOpacity
            onPress={increment}
            className="h-12 w-12 items-center justify-center rounded-full bg-card  shadow-sm">
            <Text className="text-2xl font-bold">+</Text>
         </TouchableOpacity>
      </View>
   );
};

export default Stepper;
