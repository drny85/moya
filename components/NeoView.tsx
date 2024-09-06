import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface NeumorphismWrapperProps {
   children: React.ReactNode;
   style?: StyleProp<ViewStyle>;
}

const NeumorphismWrapper: React.FC<NeumorphismWrapperProps> = ({ children, style }) => {
   return <View style={[styles.wrapper, style]}>{children}</View>;
};

const styles = StyleSheet.create({
   wrapper: {
      backgroundColor: '#e0e0e0', // Light gray background
      borderRadius: 12, // Soft edges
      shadowOffset: { width: 6, height: 6 }, // Shadow for the bottom-right
      shadowOpacity: 1,
      shadowRadius: 10,
      shadowColor: 'rgba(0, 0, 0, 0.15)', // Dark shadow for depth
      elevation: 8, // Android shadow

      // Inner highlight for top-left
      shadowColor: 'rgba(255, 255, 255, 0.6)', // White highlight
      shadowOffset: { width: -6, height: -6 }, // Highlight for top-left
   },
});

export default NeumorphismWrapper;
