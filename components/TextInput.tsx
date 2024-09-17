import React from 'react';
import { TextInput as RNTextInput, View, StyleSheet, TextInputProps } from 'react-native';
import { Controller } from 'react-hook-form';
import { formatPhone } from '~/utils/formatPhone';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';

type TextInputParams = TextInputProps & {
   name: string;
   control: any;
   label?: string | React.ReactNode;
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
   const { isDarkColorScheme } = useColorScheme();
   return (
      <View style={styles.container}>
         {label && <Text style={styles.label}>{label}</Text>}
         <Controller
            control={control}
            name={name}
            rules={rules}
            render={({
               field: { onChange, onBlur, value },
               fieldState: { error, invalid, isDirty, isTouched },
            }) => (
               <>
                  <RNTextInput
                     style={[
                        styles.input,
                        { color: isDarkColorScheme ? '#ffffff' : '#212121' },
                        error && styles.errorInput,
                        !invalid && isDirty && isTouched && styles.valid,
                     ]}
                     onBlur={onBlur}
                     onChangeText={
                        name === 'email'
                           ? (text) => onChange(text.toLowerCase())
                           : name === 'phone'
                             ? (text) => onChange(formatPhone(text))
                             : onChange
                     }
                     value={value}
                     placeholderTextColor={'grey'}
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
      marginBottom: 12,
   },
   label: {
      marginBottom: 5,
      fontSize: 16,
      fontFamily: 'Raleway-Bold',
   },
   input: {
      height: 50,
      borderColor: '#ccc',
      fontSize: 16,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
   },
   valid: {
      borderColor: 'green',
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
