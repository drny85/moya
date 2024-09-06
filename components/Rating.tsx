import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type RatingProps = {
   value: number;
   onChange: (value: number) => void;
};

const Rating: React.FC<RatingProps> = ({ value, onChange }) => {
   const handlePress = (rating: number) => {
      onChange(rating);
   };

   return (
      <View style={styles.container}>
         {[1, 2, 3, 4, 5].map((star, index) => {
            const fullStar = Math.floor(value);
            const halfStar = value % 1 !== 0;
            return (
               <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(star)}
                  style={styles.starButton}
                  activeOpacity={0.7}>
                  <MaterialIcons
                     name={
                        star <= fullStar
                           ? 'star'
                           : halfStar && star === fullStar + 1
                             ? 'star-half'
                             : 'star-border'
                     }
                     size={32}
                     color="#FFD700"
                  />
               </TouchableOpacity>
            );
         })}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
   },
   starButton: {
      paddingHorizontal: 4,
   },
});

export default Rating;
