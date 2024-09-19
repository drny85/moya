import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import LoginForm from '~/components/Forms/LoginForm';
import SignupForm from '~/components/Forms/SignupForm';
import KeyboardScreen from '~/components/KeyboardScreen';
import Loading from '~/components/Loading';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/providers/AuthContext';

type Props = {
   mode: 'login' | 'register';
   isBarber?: string;
};
const LoginScreen = () => {
   const [isSignUp, setIsSignUp] = useState(false);
   const { loading } = useAuth();
   const { colors } = useColorScheme();
   const { mode, isBarber } = useLocalSearchParams<Props>();
   useEffect(() => {
      if (mode === 'register') setIsSignUp(true);
   }, [mode]);

   if (loading) return <Loading />;

   return (
      <KeyboardScreen style={styles.container}>
         <Text className="text-center" variant={'title1'}>
            Welcome
         </Text>
         <View style={styles.authSwitch}>
            <TouchableOpacity
               onPress={() => setIsSignUp(false)}
               style={
                  !isSignUp
                     ? { ...styles.activeTab, borderBottomColor: colors.accent }
                     : styles.inactiveTab
               }>
               <Text style={!isSignUp ? styles.activeTabText : styles.inactiveTabText}>
                  Sign in
               </Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => setIsSignUp(true)}
               style={
                  isSignUp
                     ? { ...styles.activeTab, borderBottomColor: colors.accent }
                     : styles.inactiveTab
               }>
               <Text style={isSignUp ? styles.activeTabText : styles.inactiveTabText}>Sign up</Text>
            </TouchableOpacity>
         </View>

         {isSignUp ? (
            <SignupForm isBarber={isBarber !== undefined ? true : false} />
         ) : (
            <LoginForm />
         )}
      </KeyboardScreen>
   );
};

export default LoginScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      gap: 20,
   },

   authSwitch: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
   },
   activeTab: {
      borderBottomWidth: 2,
      paddingBottom: 10,
      marginRight: 20,
   },
   inactiveTab: {
      paddingBottom: 10,
      marginRight: 20,
   },
   activeTabText: {
      fontWeight: 'bold',
      fontSize: 18,
   },
   inactiveTabText: {
      color: '#888',
      fontSize: 16,
   },
   input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 15,
      marginBottom: 20,
      fontFamily: 'Roboto',
   },
   signInButton: {
      backgroundColor: '#F9A825',
      borderRadius: 5,
      padding: 15,
      alignItems: 'center',
      marginBottom: 20,
   },
   signInButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
   },
   orText: {
      textAlign: 'center',
      color: '#888',
      marginBottom: 20,
   },
   socialLoginContainer: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   socialButton: {
      flex: 1,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#4285F4',
      alignItems: 'center',
      marginHorizontal: 5,
   },
   socialButtonText: {
      fontWeight: 'bold',
   },
});
