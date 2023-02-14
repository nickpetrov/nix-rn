// utils
import React, {useEffect} from 'react';

// components
import {View, Image, SafeAreaView, Text} from 'react-native';
import StepOneForm from './components/StepOneForm';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
  useEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <FontAwesome name="angle-left" style={styles.backBtnIcon} />
            <Text>Back</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="always"
      extraHeight={200}
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
          <StepOneForm />
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};
