import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';
import { useAuth } from '~/providers/AuthContext';
import { FIREBASE_ERRORS } from '~/utils/firebaseErrorMessages';
import { Button } from '../Button';
import { Text } from '../nativewindui/Text';
import TextInput from '../TextInput';

import { Sheet, useSheetRef } from '../nativewindui/Sheet';
import ForgotPassword from './ForgtoPassword';

const loginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
   const bottomSheetRef = useSheetRef();
   const [showPassword, setShowPassword] = useState(false);
   const { control, handleSubmit } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
   });

   const { signIn } = useAuth();

   const onSubmit = async (data: LoginFormData) => {
      try {
         await signIn(data.email, data.password);
      } catch (error) {
         console.log(error);
         const err = error as Error;
         Alert.alert(FIREBASE_ERRORS[err.message]);
      }
   };

   return (
      <View className="mt-3">
         <TextInput
            name="email"
            control={control}
            autoFocus
            label="Email Address"
            keyboardType="email-address"
            enablesReturnKeyAutomatically
            autoComplete="off"
            placeholder="john.smith@email.com"
         />
         <View>
            <TextInput
               name="password"
               control={control}
               label="Password"
               textContentType="oneTimeCode"
               placeholder="Enter your password"
               secureTextEntry={!showPassword}
            />
            <TouchableOpacity className="mb-3" onPress={() => setShowPassword((prev) => !prev)}>
               <Text className="@ self-end text-muted dark:text-slate-300">
                  {showPassword ? 'hide password' : 'show password'}
               </Text>
            </TouchableOpacity>
         </View>
         <Button title="Login" onPress={handleSubmit(onSubmit)} />
         <TouchableOpacity className="mt-8" onPress={() => bottomSheetRef.current?.present()}>
            <Text className="text-center text-muted dark:text-slate-300">Forgot Password?</Text>
         </TouchableOpacity>
         {/* <Sheet snapPoints={['90%']} ref={forgotPasswordRef}>
            <ForgotPassword />
         </Sheet> */}

         <Sheet snapPoints={['80%']} ref={bottomSheetRef}>
            <ForgotPassword onPress={() => bottomSheetRef.current?.close()} />
         </Sheet>
      </View>
   );
};

export default LoginForm;
