import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

type CheckBoxProps = {
   name: string;
   control: any;
   label: string;
   rules?: any;
};

const CheckBox: React.FC<CheckBoxProps> = ({ name, control, label, rules }) => {
   return (
      <Controller
         control={control}
         name={name}
         rules={rules}
         render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View style={styles.container}>
               <TouchableOpacity style={{ marginRight: 8 }} onPress={() => onChange(!value)}>
                  {value && <AntDesign name="checkcircle" size={24} color="black" />}
                  {!value && (
                     <MaterialIcons name="radio-button-unchecked" size={24} color="black" />
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
