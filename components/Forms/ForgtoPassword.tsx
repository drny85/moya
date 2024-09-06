import { zodResolver } from '@hookform/resolvers/zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';
import { useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import { z } from 'zod';
import { Button } from '~/components/Button';

import TextInput from '~/components/TextInput';
import { auth } from '~/firebase';
import { toastAlert } from '~/lib/toast';
import { Text } from '../nativewindui/Text';
import { Feather } from '@expo/vector-icons';

const schema = z.object({
   email: z.string().email({ message: 'Invalid email address' }),
});

type FormValues = z.infer<typeof schema>;

const ForgotPassword = ({ onPress }: { onPress: () => void }) => {
   const { control, handleSubmit } = useForm<FormValues>({
      defaultValues: {
         email: '',
      },
      resolver: zodResolver(schema),
   });

   const onSubmit = async (data: FormValues) => {
      const { email } = data;
      if (!email) return;
      try {
         await sendPasswordResetEmail(auth, email);
         toastAlert({
            title: 'Password Reset Email Sent',
            message: 'Please check your email for the password reset link.',
            duration: 4,
         });
         onPress();
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <KeyboardAvoidingScrollView contentContainerClassName="flex-1">
         <TouchableOpacity className="flex-row items-center gap-1" onPress={onPress}>
            <Feather name="chevron-left" size={24} />
            <Text className="text-muted">Back</Text>
         </TouchableOpacity>
         <View className="w-full flex-1 justify-center p-3">
            <TextInput
               name="email"
               control={control}
               label="Email Address"
               keyboardType="email-address"
               placeholder="john.smith@email.com"
            />

            <Button title="Get Reset Email" onPress={handleSubmit(onSubmit)} />
         </View>
      </KeyboardAvoidingScrollView>
   );
};

export default ForgotPassword;
