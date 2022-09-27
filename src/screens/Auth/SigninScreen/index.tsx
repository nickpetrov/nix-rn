// utils
import React from 'react';

// components
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Formik, Field} from 'formik';
import {NixButton} from 'components/NixButton';
import {NixInput} from 'components/NixInput';

// hooks
import {useSignIn} from './hooks/useSignIn';

// styles
import {styles} from './SigninScreen.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

interface SigninScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Signin>;
}

export const SigninScreen: React.FC<SigninScreenProps> = ({navigation}) => {
  const {
    isLoading,
    errorTextServer,
    loginValidationSchema,
    loginHandler,
    createAccountHandler,
  } = useSignIn(navigation);

  return (
    <SafeAreaView style={styles.loginWrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView style={styles.scrollView} alwaysBounceVertical={false}>
          <View style={styles.contentWrapper}>
            <View style={styles.logo}>
              <Image
                style={styles.logoImage}
                source={require('assets/images/icon.png')}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Track</Text>
            <Text style={styles.subtitle}>Food Tracker by Nutritionix</Text>
            <Formik
              initialValues={{email: '', password: ''}}
              onSubmit={values => loginHandler(values)}
              validationSchema={loginValidationSchema}
              validateOnMount>
              {({handleSubmit, isValid}) => (
                <>
                  <Field
                    component={NixInput}
                    name="email"
                    label="Email"
                    leftComponent={
                      <FontAwesome
                        name={'envelope-o'}
                        size={30}
                        style={styles.emailField}
                      />
                    }
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <Field
                    component={NixInput}
                    name="password"
                    label="Password"
                    leftComponent={
                      <FontAwesome
                        name={'lock'}
                        size={30}
                        style={styles.passField}
                      />
                    }
                    autoCapitalize="none"
                    isPassword
                    customShowPasswordComponent={<Text>Show</Text>}
                    customHidePasswordComponent={<Text>Hide</Text>}
                  />
                  {!isLoading ? (
                    <View style={styles.btns}>
                      <NixButton
                        title="Login"
                        onPress={handleSubmit}
                        type="primary"
                        disabled={!isValid}
                      />
                      <NixButton
                        title="Create Account"
                        onPress={createAccountHandler}
                        type="default"
                      />
                    </View>
                  ) : (
                    <ActivityIndicator size="small" />
                  )}
                  {errorTextServer ? (
                    <Text style={styles.validationError}>
                      {errorTextServer}
                    </Text>
                  ) : null}
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
