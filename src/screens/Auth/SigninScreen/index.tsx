// utils
import React, {useState, useLayoutEffect} from 'react';

// components
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Formik, Field} from 'formik';
import {NixButton} from 'components/NixButton';
import {NixInput} from 'components/NixInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {WebView} from 'react-native-webview';

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
  const [showWebView, setShowWebView] = useState(false);
  const {
    isLoading,
    errorTextServer,
    loginValidationSchema,
    loginHandler,
    createAccountHandler,
  } = useSignIn(navigation);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: showWebView ? false : true,
    });
  }, [navigation, showWebView]);

  if (showWebView) {
    return (
      <View style={styles.webViewContainer}>
        <WebView
          style={styles.webView}
          source={{
            uri: 'https://www.nutritionix.com/account/forgot-password',
          }}
        />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={true}
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
                <TouchableOpacity
                  style={styles.forgotContainer}
                  onPress={() => setShowWebView(true)}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
                {!isLoading ? (
                  <View style={styles.btns}>
                    <NixButton
                      title="Login"
                      onPress={handleSubmit}
                      type="primary"
                      disabled={!isValid}
                      withMarginTop
                    />
                    <NixButton
                      title="Create Account"
                      onPress={createAccountHandler}
                      type="default"
                      withMarginTop
                    />
                  </View>
                ) : (
                  <ActivityIndicator size="small" />
                )}
                {errorTextServer ? (
                  <Text style={styles.validationError}>{errorTextServer}</Text>
                ) : null}
              </>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};
