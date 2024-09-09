import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

type MenuItemProps = {
   options: string[];
};

const MenuItem: React.FC<MenuItemProps> = ({ options }) => {
   const [expanded, setExpanded] = useState(false);
   const [selectedOption, setSelectedOption] = useState(options[0]); // Set the first option as the default selected
   const [height, setHeight] = useState(0);

   const animatedHeightStyle = useAnimatedStyle(() => {
      return {
         height: withTiming(expanded ? height : 0, { duration: 300 }),
         opacity: withTiming(expanded ? 1 : 0, { duration: 300 }),
      };
   });
   console.log(height, expanded);

   const toggleDropdown = () => {
      setExpanded(!expanded);
   };

   const handleOptionPress = (option: string) => {
      setSelectedOption(option);
      setExpanded(false); // Close dropdown after selecting an option
   };

   return (
      <View style={styles.menuItem}>
         <TouchableOpacity onPress={toggleDropdown} style={styles.menuTitle}>
            <Text style={styles.titleText}>{selectedOption}</Text>
         </TouchableOpacity>
         <Animated.View
            style={[styles.dropdownContainer, animatedHeightStyle]}
            onLayout={(event) => setHeight(event.nativeEvent.layout.height)}>
            {options.map((option, index) => (
               <TouchableOpacity key={index} onPress={() => handleOptionPress(option)}>
                  <Text style={styles.optionText}>{option}</Text>
               </TouchableOpacity>
            ))}
         </Animated.View>
      </View>
   );
};

const styles = StyleSheet.create({
   menuItem: {
      marginBottom: 20,
   },
   menuTitle: {
      backgroundColor: '#f1f1f1',
      padding: 15,
      borderRadius: 5,
   },
   titleText: {
      fontSize: 16,
      fontWeight: 'bold',
   },
   dropdownContainer: {
      overflow: 'hidden',
      backgroundColor: '#e1e1e1',
      borderRadius: 5,
      marginTop: 5,
   },
   optionText: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#d1d1d1',
   },
});

export default MenuItem;
