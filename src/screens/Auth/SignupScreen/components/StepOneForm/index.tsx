// utils
import React, {useState, useRef, useEffect, useCallback} from 'react';
import moment from 'moment-timezone';

// components
import {Field, Formik} from 'formik';
import {Text, View, Linking, TextInput} from 'react-native';
import NixCheckbox from 'components/NixCheckbox';
import {NixButton} from 'components/NixButton';
import {NixInput} from 'components/NixInput';
import CountryPicker from 'react-native-country-picker-modal';

// validation
import signupValidationSchema from './validation';

// hooks
import {useDispatch} from 'hooks';

// actions
import {signup, updateUserData} from 'store/auth/auth.actions';
import {setInfoMessage} from 'store/base/base.actions';

// styles
import {styles} from './StepOneForm.styles';
import {Colors} from 'constants/Colors';

// types
import {CountryCodes} from 'screens/LoggedIn/CompleteRegistration/types';

type Props = {
  scrollToInput: (view: TextInput | null) => void;
};

const StepOneForm: React.FC<Props> = ({scrollToInput}) => {
  const dispatch = useDispatch();
  const [validOnChange, setValidOnChange] = useState(false);
  const [countriesList, setCountriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<TextInput | null>(null);
  const confirmRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const signupHandler = (form: {
    password: string;
    email: string;
    first_name: string;
    country_code: string;
    country: string;
  }) => {
    const sentData = {
      first_name: form.first_name,
      email: form.email,
      password: form.password,
      timezone: moment.tz.guess(true) || 'US/Eastern',
    };
    const nutrion_country_code = countriesList.find(
      obj => obj['ISO3166-1-Alpha-2'] === form.country,
    );
    if (isLoading) return;
    setIsLoading(true);
    dispatch(signup(sentData))
      .then(data => {
        setIsLoading(false);
        dispatch(
          updateUserData({
            country_code: nutrion_country_code
              ? nutrion_country_code['ISO3166-1-numeric'] || '820'
              : '820',
          }),
        );
        console.log(data);
      })
      .catch(err => {
        console.log('error signup', err);
        setIsLoading(false);
        if (err.status === 409) {
          dispatch(
            setInfoMessage({
              title: 'Account Creation Failed',
              text: 'An account with this email already exists.',
              btnText: 'Ok',
            }),
          );
        } else {
          dispatch(
            setInfoMessage({
              title: 'Account Creation Failed',
              child: (
                <Text>
                  An unexpected server error has occured. Please email{' '}
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL('mailto:support@nutritionix.com')
                    }>
                    support@nutritionix.com
                  </Text>{' '}
                  and reference the reference code:{' '}
                  {err.data?.id ? err.data?.id : ''}
                </Text>
              ),
              btnText: 'Ok',
            }),
          );
        }
      });
  };

  useEffect(() => {
    try {
      const getCountries = async () => {
        const response = await fetch(
          'https://d1gvlspmcma3iu.cloudfront.net/country-codes.json',
        );
        const responseData = await response.json();
        setCountriesList(responseData);
      };

      getCountries();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }, []);

  const handleLink = useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  }, [])

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
          country_code: '820',
          country: 'US',
        }}
        onSubmit={values => signupHandler(values)}
        validationSchema={signupValidationSchema}
        validateOnBlur={true}
        validateOnChange={validOnChange}>
        {({
          handleChange,
          isValid,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.formikRoot}>
            <View style={styles.inputs}>
              <NixInput
                rootStyles={styles.inputRoot}
                labelContainerStyle={styles.labelContainerStyle}
                label="First Name"
                placeholder="e.g. Sam"
                value={values.first_name}
                onChangeText={handleChange('first_name')}
                onBlur={handleBlur('first_name')}
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
                autoCapitalize="none"
                error={touched.first_name ? errors.first_name : undefined}
                errorStyles={styles.errorStyle}
                editable={!isLoading}
              />
              <NixInput
                rootStyles={styles.inputRoot}
                labelContainerStyle={styles.labelContainerStyle}
                label="Email"
                ref={emailRef}
                placeholder="somebody@example.com"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                onSubmitEditing={() => confirmRef.current?.focus()}
                blurOnSubmit={false}
                autoCapitalize="none"
                keyboardType="email-address"
                error={touched.email ? errors.email : undefined}
                errorStyles={styles.errorStyle}
                editable={!isLoading}
                onFocus={() => {
                  scrollToInput(emailRef.current);
                }}
              />
              <NixInput
                rootStyles={styles.inputRoot}
                labelContainerStyle={styles.labelContainerStyle}
                label="Confirm Email"
                ref={confirmRef}
                placeholder="somebody@example.com"
                value={values.confirmEmail}
                onChangeText={handleChange('confirmEmail')}
                onBlur={handleBlur('confirmEmail')}
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
                autoCapitalize="none"
                keyboardType="email-address"
                error={touched.confirmEmail ? errors.confirmEmail : undefined}
                errorStyles={styles.errorStyle}
                editable={!isLoading}
                onFocus={() => {
                  scrollToInput(confirmRef.current);
                }}
              />
              <NixInput
                rootStyles={styles.inputRoot}
                labelContainerStyle={styles.labelContainerStyle}
                label="Password"
                ref={passwordRef}
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                autoCapitalize="none"
                secureTextEntry={true}
                error={touched.password ? errors.password : undefined}
                errorStyles={styles.errorStyle}
                editable={!isLoading}
                onFocus={() => {
                  scrollToInput(passwordRef.current);
                }}
              />
              <View style={styles.countrySelect}>
                <Text style={styles.countrySelectText}>Country</Text>
                <View style={{width: '65%'}}>
                  <CountryPicker
                    countryCode={values.country as CountryCodes}
                    withCallingCode={true}
                    withCountryNameButton={true}
                    withFilter={true}
                    onSelect={country => {
                      setFieldValue('country', country.cca2);
                      setFieldValue('country_code', country.callingCode[0]);
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.checkBoxContainer}>
              <Field
                component={NixCheckbox}
                name="isAgreedTerms"
                textComponent={
                  <View style={{paddingHorizontal: 18}}>
                    <Text style={{fontSize: 14, color: '#757575'}}>
                      I agree to Nutritionix Track{' '}
                      <Text
                        style={styles.link}
                        onPress={() => handleLink('https://www.nutritionix.com/terms')}>
                        Terms of Service
                      </Text>{' '}
                      and{' '}
                      <Text
                        style={styles.link}
                        onPress={() => handleLink('https://www.nutritionix.com/privacy')}>
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
                disabled={isLoading}
              />
            </View>
            <View style={styles.checkBoxContainer}>
              <Field
                component={NixCheckbox}
                name="isConfirmedThirteen"
                text="I confirm that I am at least 13 years of age."
                size={25}
                fillColor={Colors.Primary}
                unfillColor="#FFFFFF"
                iconStyle={{borderColor: '#666'}}
                textStyle={{
                  flex: 1,
                  alignSelf: 'center',
                  textDecorationLine: 'none',
                  fontSize: 14,
                }}
                disabled={isLoading}
              />
            </View>
            <NixButton
              style={{marginTop: 10}}
              title="Create Account"
              onPress={() => {
                handleSubmit();
                setValidOnChange(true);
              }}
              type="primary"
              disabled={
                !isValid ||
                !values.isConfirmedThirteen ||
                !values.isAgreedTerms ||
                values.email !== values.confirmEmail ||
                isLoading
              }
            />
          </View>
        )}
      </Formik>
    </>
  );
};

export default StepOneForm;
