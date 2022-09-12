import React from 'react';
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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Formik, Field} from 'formik';

import {NixButton} from 'components/NixButton';
import {NixInput} from 'components/NixInput';
import {useSignIn} from './hooks/useSignIn';
import {styles} from './SigninScreen.styles';

interface SigninScreenProps {
  navigation: NativeStackNavigationProp<any>;
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
                        style={{
                          marginRight: 15,
                          marginBottom: 2,
                          color: '#666',
                        }}
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
                        style={{
                          marginRight: 17,
                          marginBottom: 2,
                          marginLeft: 6,
                          color: '#666',
                        }}
                      />
                    }
                    autoCapitalize="none"
                    isPassword
                    customShowPasswordComponent={<Text>Show</Text>}
                    customHidePasswordComponent={<Text>Hide</Text>}
                  />
                  {!isLoading ? (
                    <View style={{width: '100%'}}>
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
