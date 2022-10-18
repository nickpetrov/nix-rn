// utils
import React, {useState} from 'react';
import moment from 'moment-timezone';

// components
import {Field, Formik} from 'formik';
import {ActivityIndicator, Text, View, Linking} from 'react-native';

// validation
import signupValidationSchema from './validation';

// hooks
import {useDispatch} from 'hooks';

// actions
import {setUserJwt, signup} from 'store/auth/auth.actions';

// styles
import {styles} from '../../SignupScreen.styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixInputField} from 'components/NixInputField';
import NixCheckbox from 'components/NixCheckbox';
import {Colors} from 'constants/Colors';
import {NixButton} from 'components/NixButton';

type Props = {
  setIsStep2: (a: boolean) => void;
  showErrorMessage: (error: string) => void;
  errorTextServer: string;
};

const StepOneForm: React.FC<Props> = ({
  setIsStep2,
  showErrorMessage,
  errorTextServer,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const signupHandler = (form: {
    password: string;
    email: string;
    first_name: string;
  }) => {
    const sentData = {
      first_name: form.first_name,
      email: form.email,
      password: form.password,
      timezone: moment.tz.guess() || 'US/Eastern',
    };
    if (isLoading) return;
    setIsLoading(true);
    dispatch(signup(sentData))
      .then(data => {
        setIsLoading(false);
        console.log(data);
        // show step 2 of registration process
        setIsStep2(true);
        setTimeout(() => {
          dispatch(setUserJwt(data['x-user-jwt']));
        }, 5000);
      })
      .catch(err => {
        console.log('error signup', err);
        setIsLoading(false);
        if (err.message == '409: account already exists') {
          showErrorMessage('account exists');
        } else {
          showErrorMessage('server error');
        }
      });
  };

  return (
    <>
      <Text style={styles.title}>Signup</Text>
      <Text style={styles.subtitle}>Create your free Track Account</Text>
      <Formik
        initialValues={{
          first_name: '',
          email: '',
          confirmEmail: '',
          password: '',
          isAgreedTerms: false,
          isConfirmedThirteen: false,
        }}
        onSubmit={values => signupHandler(values)}
        validationSchema={signupValidationSchema}
        validateOnMount>
        {({handleSubmit, isValid}) => (
          <>
            <Field
              component={NixInputField}
              name="first_name"
              label="First Name"
              style={styles.input}
              leftComponent={
                <FontAwesome
                  name={'user'}
                  size={30}
                  style={{marginRight: 15, marginBottom: 2, color: '#666'}}
                />
              }
              autoCapitalize="none"
            />
            <Field
              component={NixInputField}
              name="email"
              label="Email"
              style={styles.input}
              leftComponent={
                <FontAwesome
                  name={'envelope-o'}
                  size={30}
                  style={{marginRight: 15, marginBottom: 2, color: '#666'}}
                />
              }
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Field
              component={NixInputField}
              name="confirmEmail"
              label="Confirm Email"
              style={styles.input}
              leftComponent={
                <FontAwesome
                  name={'envelope-o'}
                  size={30}
                  style={{marginRight: 15, marginBottom: 2, color: '#666'}}
                />
              }
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Field
              component={NixInputField}
              name="password"
              label="Password"
              style={styles.input}
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
            <Field
              component={NixCheckbox}
              name="isAgreedTerms"
              textComponent={
                <View style={{paddingHorizontal: 18}}>
                  <Text style={{fontSize: 16, color: '#757575'}}>
                    I agree to Nutritionix Track{' '}
                    <Text
                      style={styles.link}
                      onPress={() =>
                        Linking.openURL(
                          'https://www.iubenda.com/privacy-policy/7754814',
                        )
                      }>
                      Terms of Service
                    </Text>{' '}
                    and{' '}
                    <Text
                      style={styles.link}
                      onPress={() =>
                        Linking.openURL('https://www.nutritionix.com/privacy')
                      }>
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
              }
              size={25}
              fillColor={Colors.Primary}
              unfillColor="#FFFFFF"
              iconStyle={{borderColor: '#666'}}
              textStyle={{
                textDecorationLine: 'none',
              }}
            />
            <Field
              component={NixCheckbox}
              name="isConfirmedThirteen"
              text="I confirm that I am at least 13 years of age."
              size={25}
              fillColor={Colors.Primary}
              unfillColor="#FFFFFF"
              iconStyle={{borderColor: '#666'}}
              textStyle={{
                textDecorationLine: 'none',
              }}
            />
            {!isLoading ? (
              <View style={{width: '100%'}}>
                <NixButton
                  title="Create Account"
                  onPress={handleSubmit}
                  type="primary"
                  disabled={!isValid}
                />
              </View>
            ) : (
              <ActivityIndicator size="small" />
            )}
            {!!errorTextServer ? (
              <Text style={styles.validationError}>{errorTextServer}</Text>
            ) : null}
          </>
        )}
      </Formik>
    </>
  );
};

export default StepOneForm;
