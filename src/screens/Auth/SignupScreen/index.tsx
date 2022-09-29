// utils
import React, {useState, useRef} from 'react';

// components
import {View, Image, SafeAreaView} from 'react-native';
import StepTwoForm from './components/StepTwoForm';
import StepOneForm from './components/StepOneForm';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// styles
import {styles} from './SignupScreen.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

interface SignupScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Signup>;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({navigation}) => {
  const [errorTextServer, setErrorTextServer] = useState('');
  const [isStep2, setIsStep2] = useState(false);
  const currentInputScroll = useRef(null);

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
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraHeight={200}
      innerRef={(ref: any) => (currentInputScroll.current = ref)}
      style={styles.keyboardView}>
      <SafeAreaView style={styles.loginWrapper}>
        <View style={styles.contentWrapper}>
          <View style={styles.logo}>
            <Image
              style={styles.logoImage}
              source={require('assets/images/icon.png')}
              resizeMode="contain"
            />
          </View>
          {!isStep2 ? (
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
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};
