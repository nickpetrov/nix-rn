// utils
import React, {useState} from 'react';

// components
import {
  View,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import StepTwoForm from './components/StepTwoForm';
import StepOneForm from './components/StepOneForm';

// styles
import {styles} from './SignupScreen.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface SignupScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({navigation}) => {
  const [errorTextServer, setErrorTextServer] = useState('');
  const [isStep2, setIsStep2] = useState(false);

  const showErrorMessage = (errorType: string) => {
    switch (errorType) {
      case 'server error':
        setErrorTextServer(
          'Something went wrong. Please make sure You have entered valid Email and Password',
        );
        break;
      case 'account exists':
        setErrorTextServer(
          'Account with this email already exists. If you experiencing difficulties logging in please use "Forgot Password" feature to recover your password, or ontact our suppotr team at support@nutritionix.com',
        );
        break;
      default:
        setErrorTextServer('Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.loginWrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, width: '100%'}}>
        <ScrollView
          style={{flex: 1, width: '100%', height: '100%'}}
          alwaysBounceVertical={false}>
          <View style={styles.contentWrapper}>
            <View style={styles.logo}>
              <Image
                style={styles.logoImage}
                source={require('assets/images/icon.png')}
                resizeMode="contain"
              />
            </View>
            {isStep2 ? (
              <StepOneForm
                setIsStep2={setIsStep2}
                errorTextServer={errorTextServer}
                showErrorMessage={showErrorMessage}
              />
            ) : (
              <StepTwoForm
                navigation={navigation}
                errorTextServer={errorTextServer}
                showErrorMessage={showErrorMessage}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
