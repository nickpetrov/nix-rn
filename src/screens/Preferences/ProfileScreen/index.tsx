// utils
import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';

// components
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Formik, FormikProps} from 'formik';
import {NixButton} from 'components/NixButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ModalSelector from 'react-native-modal-selector';
import {NixInput} from 'components/NixInput';
import ChooseModal from 'components/ChooseModal';
import LoadIndicator from 'components/LoadIndicator';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import {useNetInfo} from '@react-native-community/netinfo';

// actions
import * as userActions from 'store/auth/auth.actions';
import {setInfoMessage} from 'store/base/base.actions';
import {getUserWeightlog} from 'store/userLog/userLog.actions';

// services
import authService from 'api/authService';

// helpres
import {difference} from 'helpers/difference';
import {offsetDays} from 'helpers/time.helpers';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './ProfileScreen.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {User} from 'store/auth/auth.types';

// validation
import {validationSchema} from './validation';
import {replaceRegexForNumber} from 'helpers/index';
import {Colors} from 'constants/Colors';

interface ProfileScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Profile
  >;
}

interface FormikDataProps {
  first_name: string;
  last_name: string;
  timezone: string;
  measure_system: number;
  weight_kg: string;
  height_cm: string;
  height_ft?: string;
  height_in?: string;
  weight_lb?: string;
  birth_year: string;
  age?: string;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const inputRefs = useRef<{[key: string]: TextInput | null}>({});
  const netInfo = useNetInfo();
  const userData = useSelector(state => state.auth.userData);
  const selectedDate = useSelector(state => state.userLog.selectedDate);
  const dispatch = useDispatch();
  const [validOnChange, setValidOnChange] = useState(false);
  const formRef = useRef<FormikProps<FormikDataProps>>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [resetPassPopup, setResetPassPopup] = useState(false);
  const [changeEmailPopup, setChangeEmailPopup] = useState(false);
  const [oldEmail, setOldEmail] = useState(userData.email || '');
  const [email, setEmail] = useState('');
  const [timezoneList, setTimezoneList] = useState<
    {label: string; value: string}[]
  >([]);
  const cmToinches = (userData.height_cm || 0) * 0.393701;

  useEffect(() => {
    const timezones = moment.tz.names().map(tz => {
      return {
        label: tz,
        value: tz,
      };
    });
    setTimezoneList(timezones);
  }, []);

  const changeValueByMetric = (
    measure_system: number,
    values: FormikDataProps,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean,
    ) => void,
  ) => {
    if (measure_system === 1) {
      //convert imperial to metric
      const kgFromLbs = String(
        _.round((values.weight_lb ? +values.weight_lb : 0) / 2.20462, 1),
      );
      setFieldValue('weight_kg', kgFromLbs);

      const new_height =
        _.round(
          (values.height_ft ? +values.height_ft : 0) * 30.48 +
            (values.height_in ? +values.height_in : 0) * 2.54,
          2,
        ) + '';
      setFieldValue('height_cm', new_height);
    } else {
      //convert metric to imperial
      const lbFromKg = String(
        _.round((values.weight_kg ? +values.weight_kg : 0) * 2.20462, 1),
      );
      setFieldValue('weight_lb', lbFromKg);

      let ft = 0;
      let inch = _.round(
        (values.height_cm ? +values.height_cm : 0) * 0.393701,
        2,
      );

      if (inch > 12) {
        ft = _.floor(inch / 12);
        inch -= ft * 12;
      } else {
        ft = 0;
      }
      ft = _.round(ft, 2);
      inch = _.round(inch, 2);
      setFieldValue('height_ft', ft + '');
      setFieldValue('height_in', inch + '');
    }
  };

  const submitHandler = (values: FormikDataProps) => {
    Keyboard.dismiss();
    if (!netInfo.isConnected) {
      dispatch(
        setInfoMessage({
          title: 'Not available in offline mode.',
          btnText: 'Ok',
        }),
      );
      return;
    }

    setLoadingSubmit(true);
    const newUserData = {
      ...values,
      weight_kg: +values.weight_kg,
      height_cm: +values.height_cm,
      birth_year: +values.birth_year,
    };

    const diff: Array<keyof FormikDataProps> = difference(
      formRef.current?.initialValues,
      formRef.current?.values,
    );

    if (diff.length) {
      newUserData.birth_year =
        moment().year() - parseInt(newUserData.age || '0');
      if (newUserData.measure_system == 0) {
        newUserData.weight_kg = parseFloat(
          String(
            (newUserData.weight_lb ? +newUserData.weight_lb : 1) / 2.20462,
          ),
        );
        newUserData.height_cm = Math.round(
          parseFloat(String(newUserData.height_ft)) * 30.48 +
            parseFloat(String(newUserData.height_in)) * 2.54,
        );
      }
      newUserData.weight_kg = parseFloat(String(newUserData.weight_kg));

      newUserData.height_cm = parseFloat(String(newUserData.height_cm));

      newUserData.measure_system = parseInt(String(newUserData.measure_system));

      const updatedData: Partial<User> = {
        measure_system: newUserData.measure_system,
      };
      if (newUserData.first_name) {
        updatedData.first_name = newUserData.first_name;
      }
      if (newUserData.last_name) {
        updatedData.last_name = newUserData.last_name;
      }
      if (newUserData.timezone) {
        updatedData.timezone = newUserData.timezone;
      }
      if (newUserData.weight_kg) {
        updatedData.weight_kg = newUserData.weight_kg;
      }
      if (newUserData.height_cm) {
        updatedData.height_cm = newUserData.height_cm;
      }
      if (newUserData.birth_year && newUserData.birth_year !== 0) {
        updatedData.birth_year = newUserData.birth_year;
      }

      dispatch(userActions.updateUserData(updatedData as Partial<User>))
        .then(() => {
          setLoadingSubmit(false);
          navigation.goBack();
          const logBeginDate = offsetDays(selectedDate, 'YYYY-MM-DD', -7);
          const logEndDate = offsetDays(selectedDate, 'YYYY-MM-DD', 7);
          dispatch(getUserWeightlog(logBeginDate, logEndDate, 0));
        })
        .catch(() => {
          setLoadingSubmit(false);
        });
    } else {
      setLoadingSubmit(false);
    }
  };

  const age = moment().year() - (userData.birth_year || 0);
  const FormikInitValues: FormikDataProps = {
    first_name: userData.first_name,
    last_name: userData.last_name || '',
    timezone: userData.timezone || 'US/Central',
    measure_system: userData.measure_system,
    weight_kg: String(userData.weight_kg || 0),
    height_cm: String(userData.height_cm || 0),
    height_ft: String(_.floor(cmToinches / 12)),
    height_in: String(_.round(cmToinches % 12, 2)),
    weight_lb: String(
      userData.weight_kg ? _.round(userData.weight_kg * 2.20462, 1) : 0,
    ),
    birth_year: (userData.birth_year || 0) + '',
    age: String(age > 100 ? 30 : age),
  };

  const handleResetPass = () => {
    authService
      .requestUpdatePassword(email)
      .then(() => {
        setResetPassPopup(false);
        setOldEmail('');
        dispatch(
          setInfoMessage({
            title: 'Success',
            text: 'Thanks! Please check your email to continue.',
          }),
        );
      })
      .catch(err => {
        setResetPassPopup(false);
        setOldEmail('');
        if (err.data.message === 'No user matched') {
          dispatch(
            setInfoMessage({
              title: 'Error',
              text: 'Something’s not right. Please reach us at support@nutritionix.com.',
            }),
          );
        }
      });
  };
  const handleChangeEmail = () => {
    if (!email || !oldEmail) {
      setChangeEmailPopup(false);
      setOldEmail(userData.email || '');
      setEmail('');
      dispatch(
        setInfoMessage({
          title: 'Error',
          text: 'Both fields are required',
        }),
      );
      return;
    } else if (email === oldEmail) {
      setChangeEmailPopup(false);
      setOldEmail(userData.email || '');
      setEmail('');
      dispatch(
        setInfoMessage({
          title: 'Error',
          text: 'New email address is the same.',
        }),
      );
      return;
    }
    dispatch(userActions.updateUserData({email}))
      .then(() => {
        setChangeEmailPopup(false);
        setOldEmail(email);
        setEmail('');
        dispatch(
          setInfoMessage({
            title: 'Success',
            text: 'Your email has been changed',
          }),
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      <Formik
        initialValues={FormikInitValues}
        innerRef={formRef}
        onSubmit={values => submitHandler(values)}
        validationSchema={validationSchema}
        validateOnBlur={validOnChange}
        validateOnChange={validOnChange}>
        {({
          handleChange,
          isValid,
          handleSubmit,
          handleBlur,
          setFieldValue,
          values,
          errors,
        }) => {
          return (
            <View style={{flex: 1}}>
              <KeyboardAwareScrollView
                contentContainerStyle={styles.root}
                keyboardShouldPersistTaps="always"
                enableOnAndroid={true}
                enableAutomaticScroll={true}>
                <NixInput
                  selectTextOnFocus
                  label="First Name"
                  placeholder="First Name"
                  column
                  value={values.first_name}
                  onChangeText={handleChange('first_name')}
                  onBlur={handleBlur('first_name')}
                  autoCapitalize="none"
                  error={errors.first_name}
                  errorStyles={styles.errorStyles}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  ref={ref => (inputRefs.current.first_name = ref)}
                  onSubmitEditing={() => {
                    const nextRef = inputRefs.current.last_name;
                    if (nextRef) {
                      nextRef?.focus();
                    }
                  }}
                />
                <NixInput
                  selectTextOnFocus
                  label="Last Name"
                  placeholder="Last Name"
                  column
                  value={values.last_name}
                  onChangeText={handleChange('last_name')}
                  onBlur={handleBlur('last_name')}
                  autoCapitalize="none"
                  error={errors.last_name}
                  errorStyles={styles.errorStyles}
                  ref={ref => (inputRefs.current.last_name = ref)}
                />
                <ModalSelector
                  data={timezoneList}
                  initValue={userData.timezone || ''}
                  onChange={option => {
                    setFieldValue('timezone', option.value);
                    // setTimezone(option.value);
                  }}
                  initValueTextStyle={{
                    fontSize: 14,
                    color: '#000',
                    textAlign: 'left',
                  }}
                  optionTextStyle={{
                    fontSize: 16,
                    color: '#000',
                  }}
                  selectedItemTextStyle={{
                    fontSize: 16,
                    color: Colors.Info,
                    fontWeight: '500',
                  }}
                  listType="SCROLLVIEW"
                  keyExtractor={(item: {label: string; value: string}) =>
                    item.value
                  }>
                  <NixInput
                    selectTextOnFocus
                    label="Time Zone"
                    style={{textAlign: 'right'}}
                    labelContainerStyle={styles.labelContainerStyle}
                    value={values.timezone}
                    onChangeText={handleChange('timezone')}
                    onBlur={handleBlur('timezone')}
                    autoCapitalize="none">
                    <FontAwesome
                      name={'sort-down'}
                      size={15}
                      style={styles.selectIcon}
                    />
                  </NixInput>
                </ModalSelector>
                <ModalSelector
                  data={[
                    {
                      label: 'Metric',
                      value: 1,
                    },
                    {
                      label: 'Imperial (US)',
                      value: 0,
                    },
                  ]}
                  initValueTextStyle={{
                    fontSize: 14,
                    color: '#000',
                    textAlign: 'left',
                  }}
                  optionTextStyle={{
                    fontSize: 16,
                    color: '#000',
                  }}
                  selectedItemTextStyle={{
                    fontSize: 16,
                    color: Colors.Info,
                    fontWeight: '500',
                  }}
                  initValue={
                    values.measure_system === 1 ? 'Metric' : 'Imperial (US)'
                  }
                  onChange={option => {
                    if (+option.value !== +values.measure_system) {
                      changeValueByMetric(+option.value, values, setFieldValue);
                    }
                    setFieldValue('measure_system', +option.value);
                  }}
                  listType="FLATLIST"
                  keyExtractor={(item: {label: string; value: number}) =>
                    String(item.value)
                  }>
                  <NixInput
                    label="Measure system"
                    style={{textAlign: 'right'}}
                    labelContainerStyle={styles.labelContainerStyle}
                    value={
                      values.measure_system === 1 ? 'Metric' : 'Imperial (US)'
                    }
                    onChangeText={handleChange('measure_system')}
                    onBlur={handleBlur('measure_system')}
                    autoCapitalize="none">
                    <FontAwesome
                      name={'sort-down'}
                      size={15}
                      style={styles.selectIcon}
                    />
                  </NixInput>
                </ModalSelector>
                {values.measure_system === 1 ? (
                  <>
                    <NixInput
                      selectTextOnFocus
                      label="Weight"
                      placeholder="kg"
                      labelContainerStyle={styles.labelContainerStyleFull}
                      style={styles.input}
                      value={values.weight_kg}
                      unit="kg"
                      unitStyle={styles.unit}
                      onChangeText={newVal => {
                        setFieldValue(
                          'weight_kg',
                          replaceRegexForNumber(newVal) || '',
                        );
                      }}
                      maxLength={5}
                      onBlur={handleBlur('weight_kg')}
                      keyboardType="numeric"
                      autoCapitalize="none"
                      error={errors.weight_kg}
                      errorStyles={styles.errorStyles}
                      blurOnSubmit={false}
                      returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                      ref={ref => (inputRefs.current.weight_kg = ref)}
                      onSubmitEditing={() => {
                        const nextRef = inputRefs.current.height_cm;
                        if (nextRef) {
                          nextRef?.focus();
                        }
                      }}>
                      <FontAwesome
                        name={'edit'}
                        size={15}
                        style={styles.inputIcon}
                      />
                    </NixInput>
                    <NixInput
                      selectTextOnFocus
                      label="Height"
                      labelContainerStyle={styles.labelContainerStyleFull}
                      style={styles.input}
                      value={
                        values.height_cm ? _.round(+values.height_cm) + '' : ''
                      }
                      unit="cm"
                      unitStyle={styles.unit}
                      onChangeText={newVal => {
                        const val = newVal.replace(/[^0-9]/g, '');
                        setFieldValue('height_cm', val);
                      }}
                      onBlur={handleBlur('height_cm')}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      placeholder="cm"
                      error={errors.height_cm}
                      errorStyles={styles.errorStyles}
                      blurOnSubmit={false}
                      returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                      ref={ref => (inputRefs.current.height_cm = ref)}
                      onSubmitEditing={() => {
                        const nextRef = inputRefs.current.age;
                        if (nextRef) {
                          nextRef?.focus();
                        }
                      }}>
                      <FontAwesome
                        name={'edit'}
                        size={15}
                        style={styles.inputIcon}
                      />
                    </NixInput>
                  </>
                ) : (
                  <>
                    <NixInput
                      selectTextOnFocus
                      label="Weight"
                      labelContainerStyle={styles.labelContainerStyleFull}
                      style={styles.input}
                      value={values.weight_lb || ''}
                      unit="lbs"
                      unitStyle={styles.unit}
                      onChangeText={newVal => {
                        setFieldValue(
                          'weight_lb',
                          replaceRegexForNumber(newVal) || '',
                        );
                      }}
                      maxLength={5}
                      onBlur={handleBlur('weight_lb')}
                      keyboardType="numeric"
                      autoCapitalize="none"
                      placeholder="lbs."
                      error={errors.weight_lb}
                      errorStyles={styles.errorStyles}
                      blurOnSubmit={false}
                      returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                      ref={ref => (inputRefs.current.weight_lb = ref)}
                      onSubmitEditing={() => {
                        const nextRef = inputRefs.current.height_ft;
                        if (nextRef) {
                          nextRef?.focus();
                        }
                      }}>
                      <FontAwesome
                        name={'edit'}
                        size={15}
                        style={styles.inputIcon}
                      />
                    </NixInput>
                    <NixInput
                      selectTextOnFocus
                      label="Height"
                      labelContainerStyle={styles.labelContainerStyleFull}
                      style={styles.input}
                      value={
                        values.height_ft ? _.round(+values.height_ft) + '' : ''
                      }
                      unit="ft"
                      unitStyle={styles.unit}
                      onChangeText={newVal => {
                        setFieldValue('height_ft', newVal);
                      }}
                      onBlur={handleBlur('height_ft')}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      placeholder="ft."
                      error={errors.height_ft}
                      errorStyles={styles.errorStyles}
                      blurOnSubmit={false}
                      returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                      ref={ref => (inputRefs.current.height_ft = ref)}
                      onSubmitEditing={() => {
                        const nextRef = inputRefs.current.height_in;
                        if (nextRef) {
                          nextRef?.focus();
                        }
                      }}>
                      <FontAwesome
                        name={'edit'}
                        size={15}
                        style={styles.inputIcon}
                      />
                    </NixInput>
                    <NixInput
                      selectTextOnFocus
                      label=""
                      labelContainerStyle={styles.labelContainerStyleFull}
                      style={styles.input}
                      value={
                        values.height_in ? _.round(+values.height_in) + '' : ''
                      }
                      unit="in"
                      unitStyle={styles.unit}
                      onChangeText={newVal => {
                        setFieldValue('height_in', newVal);
                      }}
                      onBlur={handleBlur('height_in')}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      placeholder="in."
                      error={errors.height_in}
                      errorStyles={styles.errorStyles}
                      blurOnSubmit={false}
                      returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                      ref={ref => (inputRefs.current.height_in = ref)}
                      onSubmitEditing={() => {
                        const nextRef = inputRefs.current.age;
                        if (nextRef) {
                          nextRef?.focus();
                        }
                      }}>
                      <FontAwesome
                        name={'edit'}
                        size={15}
                        style={styles.inputIcon}
                      />
                    </NixInput>
                  </>
                )}
                <NixInput
                  selectTextOnFocus
                  label="Age"
                  labelContainerStyle={styles.labelContainerStyleFull}
                  style={styles.input}
                  value={values.age || ''}
                  unit="years"
                  unitStyle={styles.unit}
                  onChangeText={(newVal: string) => {
                    const val = newVal.replace(/[^0-9]/g, '');
                    setFieldValue('birth_year', moment().year() - +val);
                    setFieldValue('age', val);
                  }}
                  onBlur={handleBlur('age')}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  placeholder=""
                  error={errors.age}
                  errorStyles={styles.errorStyles}
                  ref={ref => (inputRefs.current.age = ref)}>
                  <FontAwesome
                    name={'edit'}
                    size={15}
                    style={styles.inputIcon}
                  />
                </NixInput>
                <View style={styles.footer}>
                  <View style={styles.btnContainer}>
                    <NixButton
                      title="Reset Password"
                      type="outline"
                      onPress={() => setResetPassPopup(true)}
                    />
                  </View>
                  <View style={styles.btnContainer}>
                    <NixButton
                      title="Change email"
                      type="outline"
                      onPress={() => setChangeEmailPopup(true)}
                    />
                  </View>
                </View>
              </KeyboardAwareScrollView>
              {isValid && (
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                  contentContainerStyle={{flex: 1}}
                  style={styles.saveBtnContainer}>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={() => {
                      setValidOnChange(true);
                      handleSubmit();
                    }}
                    disabled={!isValid || loadingSubmit}>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              )}
            </View>
          );
        }}
      </Formik>
      <ChooseModal
        modalVisible={changeEmailPopup}
        hideModal={() => {
          setChangeEmailPopup(false);
          setOldEmail('');
          setEmail('');
        }}
        title="Email change"
        btns={[
          {
            type: 'primary',
            title: 'Sumbit',
            onPress: () => {
              handleChangeEmail();
            },
            disabled: loadingSubmit,
          },
          {
            type: 'gray',
            title: 'Cancel',
            onPress: () => {
              setChangeEmailPopup(false);
              setOldEmail(userData.email || '');
              setEmail('');
            },
          },
        ]}>
        <View style={{marginBottom: 10}}>
          <Text style={styles.modalLabel}>Old Email</Text>
          <TextInput
            placeholder="Old Email"
            value={oldEmail}
            onChangeText={(v: string) => setOldEmail(v)}
          />
          <Text style={styles.modalLabel}>New Email</Text>
          <TextInput
            placeholder="New Email"
            value={email}
            onChangeText={(v: string) => setEmail(v)}
          />
        </View>
      </ChooseModal>
      <ChooseModal
        modalVisible={resetPassPopup}
        hideModal={() => {
          setResetPassPopup(false);
          setEmail('');
        }}
        title="Please type your email"
        btns={[
          {
            type: 'primary',
            title: 'Sumbit',
            onPress: () => {
              handleResetPass();
            },
            disabled: loadingSubmit || !email,
          },
          {
            type: 'gray',
            title: 'Cancel',
            onPress: () => {
              setResetPassPopup(false);
              setEmail('');
            },
          },
        ]}>
        <TextInput
          placeholder="What is your email address?"
          value={email}
          onChangeText={(v: string) => setEmail(v)}
          autoCapitalize="none"
          textContentType="emailAddress"
        />
      </ChooseModal>

      {loadingSubmit && <LoadIndicator withShadow />}
    </>
  );
};
