import React from 'react';
import { Button, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import TextInput from '../TextInput';
import CheckBox from '../CheckBox';
import { useAuth } from '~/providers/AuthContext';
import { DEFAULT_SCHEDULE } from '~/constants';
import { AppUser } from '~/shared/types';
import { Text } from '../nativewindui/Text';
import { router, useLocalSearchParams } from 'expo-router';

const signupSchema = z
   .object({
      name: z
         .string({ message: 'Full name is required' })
         .min(5, 'Full name must be at least 5 characters long')
         .refine(
            (value) => {
               const parts = value.trim().split(' ');
               return parts.length >= 2 && parts.every((part) => part.length > 1);
            },
            {
               message:
                  'Full name must include at least a first name and a last name, each at least 2 characters long',
            }
         ),
      email: z.string().email(),
      phone: z.string().min(14, 'Invalid phone').optional(),
      password: z.string().min(6, 'Password must be at least 6 characters long'),
      confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
      isBarber: z.boolean().optional(),
      //   acceptTerms: z.boolean().refine((val) => val === true, {
      //      message: 'You must accept the terms and conditions',
      //   }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'], // Specify the field for the error message
   });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
   const { signUp, createUser } = useAuth();
   const params = useLocalSearchParams();

   const { control, handleSubmit } = useForm<SignupFormData>({
      resolver: zodResolver(signupSchema),
   });

   const onSubmit = async (data: SignupFormData) => {
      try {
         const { user } = await signUp(data.email, data.password, data.isBarber || false);
         if (user) {
            let newUser: AppUser;
            if (data.isBarber) {
               newUser = {
                  id: user.uid,
                  email: data.email,
                  phone: data.phone || '',
                  name: data.name || '',
                  isBarber: true,
                  isActive: false,
                  pushToken: null,
                  gallery: [],
                  minutesInterval: 30,
                  isAvailable: true,
                  bio: 'Professional barber with a focus on traditional styles and techniques.',
                  image: null,
                  schedule: DEFAULT_SCHEDULE,
               };
            } else {
               newUser = {
                  id: user.uid,
                  email: data.email,
                  phone: data.phone || '',
                  image: null,
                  pushToken: null,
                  name: data.name || '',
                  isBarber: false,
                  favoriteBarber: null,
               };
            }

            const userSaved = await createUser(newUser);
            if (userSaved) {
               if (user) {
                  if (params && params.returnUrl) {
                     router.replace(params.returnUrl as any);
                  }
               }
            } else {
               console.log('Error creating user');
            }
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
         <TextInput
            name="name"
            autoFocus
            control={control}
            label="Full Name"
            placeholder="John Smith"
            autoCapitalize="words"
         />
         <TextInput
            name="phone"
            control={control}
            label={
               <Text>
                  Cell Phone <Text className="text-sm text-muted">(optional)</Text>
               </Text>
            }
            keyboardType="numeric"
            placeholder="(646) 588-8888"
         />
         <TextInput
            name="email"
            control={control}
            label="Email Address"
            keyboardType="email-address"
            placeholder="john.smith@email.com"
         />

         <TextInput
            name="password"
            control={control}
            textContentType="oneTimeCode"
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
         />
         <TextInput
            name="confirmPassword"
            control={control}
            textContentType="oneTimeCode"
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry
         />
         <CheckBox name="isBarber" control={control} label="Are you signing up as a barber?" />
         {/* <CheckBox name="acceptTerms" control={control} label="I accept the terms and conditions" /> */}
         <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
   );
};

export default SignupForm;
