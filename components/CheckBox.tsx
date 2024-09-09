import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

type CheckBoxProps = {
   name: string;
   control: any;
   label: string;
   rules?: any;
};

const CheckBox: React.FC<CheckBoxProps> = ({ name, control, label, rules }) => {
   const { isDarkColorScheme } = useColorScheme();
   return (
      <Controller
         control={control}
         name={name}
         rules={rules}
         render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View style={styles.container}>
               <TouchableOpacity style={{ marginRight: 8 }} onPress={() => onChange(!value)}>
                  {value && (
                     <AntDesign
                        name="checkcircle"
                        size={24}
                        color={isDarkColorScheme ? '#ffffff' : '#212121'}
                     />
                  )}
                  {!value && (
                     <MaterialIcons
                        name="radio-button-unchecked"
                        size={24}
                        color={isDarkColorScheme ? '#ffffff' : '#212121'}
                     />
                  )}
               </TouchableOpacity>
               <Text style={styles.label}>{label}</Text>
               {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
         )}
      />
   );
};

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
   },

   checked: {
      backgroundColor: '#007bff',
   },
   label: {
      fontSize: 16,
   },
   errorText: {
      color: 'red',
      marginTop: 5,
      marginLeft: 34,
   },
});

export default CheckBox;
