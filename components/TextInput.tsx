import React from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { Controller } from 'react-hook-form';
import { formatPhone } from '~/utils/formatPhone';

type TextInputParams = TextInputProps & {
   name: string;
   control: any;
   label?: string;
   placeholder?: string;
   secureTextEntry?: boolean;
   capitalize?: boolean;
   rules?: any;
};

const TextInput: React.FC<TextInputParams> = ({
   name,
   control,
   label,
   placeholder,
   secureTextEntry,
   rules,
   ...others
}) => {
   return (
      <View style={styles.container}>
         {label && <Text style={styles.label}>{label}</Text>}
         <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
               <>
                  <RNTextInput
                     style={[styles.input, error && styles.errorInput]}
                     onBlur={onBlur}
                     onChangeText={
                        name === 'email'
                           ? (text) => onChange(text.toLowerCase())
                           : name === 'phone'
                             ? (text) => onChange(formatPhone(text))
                             : onChange
                     }
                     value={value}
                     placeholder={placeholder}
                     secureTextEntry={secureTextEntry}
                     {...others}
                  />
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
               </>
            )}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      marginBottom: 20,
   },
   label: {
      marginBottom: 5,
      fontSize: 16,
      fontWeight: 'bold',
   },
   input: {
      height: 50,
      borderColor: '#ccc',
      fontSize: 16,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
   },
   errorInput: {
      borderColor: 'red',
   },
   errorText: {
      color: 'red',
      marginTop: 5,
   },
});

export default TextInput;
