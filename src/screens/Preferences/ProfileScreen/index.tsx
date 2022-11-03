// utils
import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';

// components
import {View, TouchableOpacity, Text, TextInput} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Formik, FormikProps} from 'formik';
import {NixButton} from 'components/NixButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ModalSelector from 'react-native-modal-selector';
import {NixInput} from 'components/NixInput';
import ChooseModal from 'components/ChooseModal';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import {useNetInfo} from '@react-native-community/netinfo';

// actions
import * as userActions from 'store/auth/auth.actions';
import {setInfoMessage} from 'store/base/base.actions';

// services
import authService from 'api/authService';

// helpres
import {difference} from 'helpers/difference';

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
  const netInfo = useNetInfo();
  const userData = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormikDataProps>>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [resetPassPopup, setResetPassPopup] = useState(false);
  const [changeEmailPopup, setChangeEmailPopup] = useState(false);
  const [oldEmail, setOldEmail] = useState(userData.email || '');
  const [email, setEmail] = useState('');
  const [timezoneList, setTimezoneList] = useState<
    {label: string; value: string}[]
  >([]);
  const cmToinches = userData.height_cm * 0.393701;

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

      delete newUserData.weight_lb;
      delete newUserData.height_ft;
      delete newUserData.height_in;
      delete newUserData.age;

      dispatch(userActions.updateUserData(newUserData as Partial<User>))
        .then(() => {
          setLoadingSubmit(false);
          navigation.goBack();
        })
        .catch(() => {
          setLoadingSubmit(false);
        });
    }
  };

  const FormikInitValues: FormikDataProps = {
    first_name: userData.first_name,
    last_name: userData.last_name || '',
    timezone: userData.timezone,
    measure_system: userData.measure_system,
    weight_kg: String(userData.weight_kg),
    height_cm: String(userData.height_cm),
    height_ft: String(_.floor(cmToinches / 12)),
    height_in: String(_.round(cmToinches % 12, 2)),
    weight_lb: String(_.round(userData.weight_kg * 2.20462, 1)),
    birth_year: userData.birth_year + '',
    age: String(moment().year() - userData.birth_year),
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
    dispatch(userActions.updateUserData({email})).then(() => {
      setChangeEmailPopup(false);
      setOldEmail(email);
      setEmail('');
      dispatch(
        setInfoMessage({
          title: 'Success',
          text: 'Your email has been changed',
        }),
      );
    });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.root}
      enableOnAndroid={true}
      enableAutomaticScroll={true}>
      <Formik
        initialValues={FormikInitValues}
        innerRef={formRef}
        onSubmit={values => submitHandler(values)}
        validationSchema={validationSchema}
        validateOnBlur>
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
              <NixInput
                label="First Name"
                placeholder="First Name"
                column
                value={values.first_name}
                onChangeText={handleChange('first_name')}
                onBlur={handleBlur('first_name')}
                autoCapitalize="none"
                error={errors.first_name}
                errorStyles={styles.errorStyles}
              />
              <NixInput
                label="Last Name"
                placeholder="Last Name"
                column
                value={values.last_name}
                onChangeText={handleChange('last_name')}
                onBlur={handleBlur('last_name')}
                autoCapitalize="none"
                error={errors.last_name}
                errorStyles={styles.errorStyles}
              />
              <ModalSelector
                data={timezoneList}
                initValue={userData.measure_system + ''}
                onChange={option => {
                  setFieldValue('timezone', option.value);
                  // setTimezone(option.value);
                }}
                listType="FLATLIST"
                keyExtractor={(item: {label: string; value: string}) =>
                  item.value
                }>
                <NixInput
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
                initValue={values.measure_system + ''}
                onChange={option => {
                  if (+option.value !== +values.measure_system) {
                    changeValueByMetric(option.value, values, setFieldValue);
                  }
                  setFieldValue('measure_system', option.value);
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
                    label="Weight"
                    placeholder="kg"
                    labelContainerStyle={styles.labelContainerStyleFull}
                    style={styles.input}
                    value={values.weight_kg}
                    unit="kg"
                    unitStyle={styles.unit}
                    onChangeText={handleChange('weight_kg')}
                    onBlur={handleBlur('weight_kg')}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    error={errors.weight_kg}
                    errorStyles={styles.errorStyles}>
                    <FontAwesome
                      name={'edit'}
                      size={15}
                      style={styles.inputIcon}
                    />
                  </NixInput>
                  <NixInput
                    label="Height"
                    labelContainerStyle={styles.labelContainerStyleFull}
                    style={styles.input}
                    value={values.height_cm + ''}
                    unit="cm"
                    unitStyle={styles.unit}
                    onChangeText={handleChange('height_cm')}
                    onBlur={handleBlur('height_cm')}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    placeholder="cm"
                    error={errors.height_cm}
                    errorStyles={styles.errorStyles}>
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
                    label="Weight"
                    labelContainerStyle={styles.labelContainerStyleFull}
                    style={styles.input}
                    value={values.weight_lb || ''}
                    unit="lbs"
                    unitStyle={styles.unit}
                    onChangeText={handleChange('weight_lb')}
                    onBlur={handleBlur('weight_lb')}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    placeholder="lbs."
                    error={errors.weight_lb}
                    errorStyles={styles.errorStyles}>
                    <FontAwesome
                      name={'edit'}
                      size={15}
                      style={styles.inputIcon}
                    />
                  </NixInput>
                  <NixInput
                    label="Height"
                    labelContainerStyle={styles.labelContainerStyleFull}
                    style={styles.input}
                    value={values.height_ft || ''}
                    unit="ft"
                    unitStyle={styles.unit}
                    onChangeText={handleChange('height_ft')}
                    onBlur={handleBlur('height_ft')}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    placeholder="ft."
                    error={errors.height_ft}
                    errorStyles={styles.errorStyles}>
                    <FontAwesome
                      name={'edit'}
                      size={15}
                      style={styles.inputIcon}
                    />
                  </NixInput>
                  <NixInput
                    label=""
                    labelContainerStyle={styles.labelContainerStyleFull}
                    style={styles.input}
                    value={values.height_in || ''}
                    unit="in"
                    unitStyle={styles.unit}
                    onChangeText={handleChange('height_in')}
                    onBlur={handleBlur('height_in')}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    placeholder="in."
                    error={errors.height_in}
                    errorStyles={styles.errorStyles}>
                    <FontAwesome
                      name={'edit'}
                      size={15}
                      style={styles.inputIcon}
                    />
                  </NixInput>
                </>
              )}
              <NixInput
                label="Age"
                labelContainerStyle={styles.labelContainerStyleFull}
                style={styles.input}
                value={values.age || ''}
                unit="years"
                unitStyle={styles.unit}
                onChangeText={(newVal: string) => {
                  setFieldValue('birth_year', moment().year() - +newVal);
                  setFieldValue('age', newVal);
                }}
                onBlur={handleBlur('age')}
                keyboardType="numeric"
                autoCapitalize="none"
                placeholder=""
                error={errors.age}
                errorStyles={styles.errorStyles}>
                <FontAwesome name={'edit'} size={15} style={styles.inputIcon} />
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
              {isValid && (
                <View style={styles.saveBtnContainer}>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSubmit}
                    disabled={!isValid || loadingSubmit}>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
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
          setOldEmail('');
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
              setOldEmail('');
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
    </KeyboardAwareScrollView>
  );
};
