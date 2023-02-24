// utils
import React, {useState, useEffect, useRef} from 'react';

// components
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Formik} from 'formik';
import {NixButton} from 'components/NixButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {WebView} from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
import {TouchableWithoutFeedback, Keyboard} from 'react-native';

interface SigninScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Signin>;
}

export const SigninScreen: React.FC<SigninScreenProps> = ({navigation}) => {
  const [showWebView, setShowWebView] = useState(false);
  const [validOnChange, setValidOnChange] = useState(false);
  const {isLoading, loginValidationSchema, loginHandler, createAccountHandler} =
    useSignIn(navigation);
  const passwordRef = useRef<TextInput | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: showWebView ? false : true,
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
  }, [navigation, showWebView]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!showWebView) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Prompt the user before leaving the screen
        setShowWebView(false);
      }),
    [navigation, showWebView],
  );

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
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={{flex: 1}}
      accessible={false}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
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
            <Text style={styles.subtitle}>Food Logging by Nutritionix</Text>
            <Formik
              initialValues={{email: '', password: ''}}
              onSubmit={values => loginHandler(values)}
              validationSchema={loginValidationSchema}
              validateOnBlur={validOnChange}
              validateOnChange={validOnChange}>
              {({
                handleChange,
                isValid,
                handleSubmit,
                handleBlur,
                values,
                errors,
              }) => (
                <View style={styles.formikRoot}>
                  <View style={styles.inputs}>
                    <NixInput
                      rootStyles={{...styles.inputRoot}}
                      label="Email"
                      placeholder="Email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      error={errors.email}
                      withoutErorrText
                      withErrorBorder
                      autoCorrect={false}
                      editable={!isLoading}
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                    <NixInput
                      rootStyles={{
                        ...styles.inputRoot,
                        ...styles.inputRootWithoutBorder,
                      }}
                      label="Password"
                      placeholder="Password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      ref={passwordRef}
                      autoCapitalize="none"
                      secureTextEntry={true}
                      error={errors.password}
                      withoutErorrText
                      withErrorBorder
                      editable={!isLoading}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.forgotContainer}
                    onPress={() => setShowWebView(true)}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                  <View style={styles.btns}>
                    <NixButton
                      title="Login"
                      onPress={() => {
                        handleSubmit();
                        setValidOnChange(true);
                      }}
                      type="primary"
                      disabled={!isValid || isLoading}
                      withMarginTop
                    />
                    <NixButton
                      title="Create Account"
                      onPress={createAccountHandler}
                      type="default"
                      withMarginTop
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};
