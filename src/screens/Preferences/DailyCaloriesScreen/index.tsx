// utils
import React, {useState, useRef, useEffect, useLayoutEffect} from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
import {useNetInfo} from '@react-native-community/netinfo';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Formik, FormikProps} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ModalSelector from 'react-native-modal-selector';
import {NavigationHeader} from 'components/NavigationHeader';
import {NixInput} from 'components/NixInput';
import {Platform} from 'react-native';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as authActions from 'store/auth/auth.actions';
import {setInfoMessage} from 'store/base/base.actions';

// helpers
import * as NixCalc from 'helpers/nixCalculator';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './DailyCaloriesScreen.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {User} from 'store/auth/auth.types';

// validation
import {validationSchema} from './validation';

interface DailyCaloriesScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.DailyCalories
  >;
}

interface FormikDataProps {
  measure_system: number;
  weight_kg: string;
  height_cm: string;
  height_ft?: string;
  height_in?: string;
  weight_lb?: string;
  birth_year: string;
  gender: string;
  daily_kcal: string;
  age?: string;
}

export const DailyCaloriesScreen: React.FC<DailyCaloriesScreenProps> = ({
  navigation,
}) => {
  const netInfo = useNetInfo();
  const userData = useSelector(state => state.auth.userData);
  const [validOnChange, setValidOnChange] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [updateCalorieMessage, setUpdateCalorieMessage] = useState('');
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormikDataProps>>(null);

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
    const newUserData: Partial<User> = {
      daily_kcal: +values.daily_kcal,
      gender: values.gender,
      measure_system: +values.measure_system,
    };

    if (
      +values.weight_kg &&
      +values.weight_kg !== 0 &&
      userData.weight_kg !== +values.weight_kg &&
      newUserData.measure_system === 1
    ) {
      newUserData.weight_kg = parseFloat(values.weight_kg);
    }

    if (
      values.height_cm &&
      +values.height_cm !== 0 &&
      newUserData.measure_system === 1
    ) {
      newUserData.height_cm = +values.height_cm;
    }

    if (values.age && +values.age !== 0) {
      const birth_year = moment().year() - parseInt(values.age);
      if (birth_year > 0) {
        newUserData.birth_year = birth_year;
      }
    }

    if (newUserData.measure_system === 0) {
      if (values.weight_lb && +values.weight_lb > 0) {
        newUserData.weight_kg = parseFloat(
          String(values.weight_lb ? +values.weight_lb : 1 / 2.20462),
        );
      }
      if (values.height_ft && +values.height_ft > 0) {
        newUserData.height_cm = Math.round(
          parseFloat(String(values.height_ft)) * 30.48 +
            parseFloat(String(values.height_in)) * 2.54,
        );
      }
    }

    dispatch(authActions.updateUserData(newUserData as Partial<User>))
      .then(() => {
        setLoadingSubmit(false);
        setUpdateCalorieMessage('Updated');
        navigation.navigate(Routes.Dashboard);
      })
      .catch(err => {
        setUpdateCalorieMessage(err.data?.message || 'Error');
        setLoadingSubmit(false);
      });
  };

  useEffect(() => {
    if (updateCalorieMessage) {
      setTimeout(() => {
        setUpdateCalorieMessage('');
      }, 3000);
    }
  }, [updateCalorieMessage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <NavigationHeader
          {...props}
          headerRight={
            <TouchableOpacity
              style={styles.question}
              onPress={() =>
                navigation.navigate(Routes.WebView, {
                  url: 'https://help.nutritionix.com/articles/6153-setting-understanding-your-daily-calorie-limit',
                })
              }>
              <FontAwesome5 size={15} color={'white'} name="question" />
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [navigation]);

  const cmToinches = (userData.height_cm || 0) * 0.393701;
  const FormikInitValues: FormikDataProps = {
    measure_system: userData.measure_system || 0,
    weight_kg: String(userData.weight_kg || 0),
    height_cm: String(userData.height_cm || 0),
    height_ft: String(_.floor(cmToinches / 12)),
    height_in: String(_.round(cmToinches % 12, 2)),
    weight_lb: String(
      userData.weight_kg ? _.round(userData.weight_kg * 2.20462, 1) : 0,
    ),
    gender: userData.gender || 'female',
    birth_year: (userData.birth_year || 0) + '',
    daily_kcal: userData.daily_kcal + '',
    age: moment().year() - (userData.birth_year || 0) + '',
  };

  const showDisclaimer = () => {
    dispatch(
      setInfoMessage({
        title:
          'Many different variables affect a person’s energy needs, including age, height, weight, and sex.',
      }),
    );
  };

  const getRecommendedCalories = (values: FormikDataProps) => {
    let weight_kg, height_cm;

    // if now imperial(US)
    if (values.measure_system === 0) {
      weight_kg = _.round(
        (values.weight_lb ? +values.weight_lb : 0) / 2.20462,
        1,
      );
      height_cm = _.round(
        (values.height_ft ? +values.height_ft : 0) * 30.48 +
          (values.height_in ? +values.height_in : 0) * 2.54,
        2,
      );
    } else {
      weight_kg = values.weight_kg;
      height_cm = values.height_cm;
    }
    return (
      NixCalc.calculateRecommendedCalories(
        values.gender || 'female',
        +weight_kg,
        +height_cm,
        +(values.age || 0),
      ) || 0
    );
  };

  return (
    <Formik
      initialValues={FormikInitValues}
      innerRef={formRef}
      onSubmit={values => {
        submitHandler(values);
      }}
      enableReinitialize
      validationSchema={validationSchema}
      validateOnChange={validOnChange}
      validateOnBlur={validOnChange}
      validateOnMount>
      {({
        handleChange,
        handleSubmit,
        isValid,
        handleBlur,
        setFieldValue,
        values,
        errors,
      }) => (
        <SafeAreaView style={styles.root}>
          <KeyboardAwareScrollView
            style={styles.container}
            enableOnAndroid={true}
            enableAutomaticScroll={true}>
            <View style={styles.fields}>
              <ModalSelector
                data={[
                  {
                    label: 'Metric',
                    value: 1,
                  },
                  {
                    label: 'Imperial(US)',
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
                  label="Units"
                  style={{textAlign: 'right'}}
                  labelContainerStyle={styles.labelContainerStyle}
                  value={
                    values.measure_system === 1 ? 'Metric' : 'Imperial(US)'
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

              <View>
                <ModalSelector
                  data={[
                    {
                      label: 'Male',
                      value: 'male',
                    },
                    {
                      label: 'Female',
                      value: 'female',
                    },
                  ]}
                  initValue={values.gender}
                  onChange={option => {
                    setFieldValue('gender', option.value);
                  }}
                  listType="FLATLIST"
                  keyExtractor={(item: {label: string; value: string}) =>
                    item.value
                  }>
                  <View>
                    <NixInput
                      label="Sex"
                      style={{textAlign: 'right'}}
                      labelContainerStyle={styles.labelContainerStyle}
                      value={values.gender === 'male' ? 'Male' : 'Female'}
                      onChangeText={handleChange('gender')}
                      onBlur={handleBlur('gender')}
                      autoCapitalize="none">
                      <FontAwesome
                        name={'sort-down'}
                        size={15}
                        style={styles.selectIcon}
                      />
                    </NixInput>
                  </View>
                </ModalSelector>
                <View style={styles.infoCircle}>
                  <TouchableWithoutFeedback onPress={showDisclaimer}>
                    <FontAwesome
                      name={'info-circle'}
                      size={18}
                      style={styles.infoCircleIcon}
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
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
                    value={_.round(+values.height_cm) + ''}
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
                    value={
                      values.height_ft ? _.round(+values.height_ft) + '' : ''
                    }
                    unit="ft"
                    unitStyle={styles.unit}
                    onChangeText={newVal => {
                      const val = newVal.replace(/[^0-9]/g, '');
                      setFieldValue('height_ft', val);
                    }}
                    onBlur={handleBlur('height_ft')}
                    keyboardType="number-pad"
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
                    value={
                      values.height_in ? _.round(+values.height_in) + '' : ''
                    }
                    unit="in"
                    unitStyle={styles.unit}
                    onChangeText={newVal => {
                      const val = newVal.replace(/[^0-9]/g, '');
                      setFieldValue('height_in', val);
                    }}
                    onBlur={handleBlur('height_in')}
                    keyboardType="number-pad"
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
                rootStyles={{borderBottomWidth: 0}}
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
                errorStyles={styles.errorStyles}>
                <FontAwesome name={'edit'} size={15} style={styles.inputIcon} />
              </NixInput>
            </View>
            {!!getRecommendedCalories(values) && (
              <View
                style={[
                  styles.panel,
                  Platform.OS === 'ios' ? styles.elevation : styles.shadow,
                ]}>
                <View style={styles.panelHeader}>
                  <Text>Recommended Calorie Values</Text>
                </View>
                <View style={styles.panelBody}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Text style={styles.recommendedKcal}>
                      {getRecommendedCalories(values)}
                    </Text>
                    <Text>Maintain Current Weight</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Text style={styles.recommendedKcal}>
                      {getRecommendedCalories(values) - 500}
                    </Text>
                    <Text>
                      Lose {values.measure_system === 1 ? '~0.5 kg' : '~1 lb'}{' '}
                      per week
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.recommendedKcal}>
                      {getRecommendedCalories(values) + 500}
                    </Text>
                    <Text>
                      Gain {values.measure_system === 1 ? '~0.5 kg' : '~1 lb'}{' '}
                      per week
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <View
              style={[
                styles.panel,
                Platform.OS === 'ios' ? styles.elevation : styles.shadow,
              ]}>
              <View style={styles.panelHeader}>
                <Text>Enter daily calorie limit: </Text>
              </View>
              <NixInput
                label="My Daily Calorie Limit:"
                rootStyles={{paddingHorizontal: 10, borderBottomWidth: 0}}
                labelContainerStyle={styles.kcalLabelContainer}
                style={styles.kcalInput}
                value={values.daily_kcal}
                onChangeText={handleChange('daily_kcal')}
                onBlur={handleBlur('daily_kcal')}
                autoCapitalize="none"
                error={errors.daily_kcal}
                errorStyles={styles.errorStyles}
                keyboardType="numeric"
              />
            </View>
            {!!updateCalorieMessage && (
              <Text style={styles.updateCalorieMessage}>
                {updateCalorieMessage}
              </Text>
            )}
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                <Text style={{fontWeight: 'bold'}}>Disclaimer: </Text>
                This information is for use in adults defined as individuals 18
                years of age or older and not by younger people, or pregnant or
                breastfeeding women.This information is not intended to provide
                medical advice.A health care provider who has examined you and
                knows your medical history is the best person to diagnose and
                treat your health problem. If you have specific health
                questions, please consult your health care provider.Calorie
                calculations are based on the Harris Benedict equation, and
                corrected MET values are provided as referenced at these
                sources:
              </Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate(Routes.WebView, {
                    url: 'https://sites.google.com/site/compendiumofphysicalactivities/corrected-mets',
                  });
                }}>
                <Text style={styles.hyperlink}>
                  Compendium of Physical Activities
                </Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate(Routes.WebView, {
                    url: 'http://www.umass.edu/physicalactivity/newsite/publications/Sarah%20Keadle/papers/1.pdf',
                  });
                }}>
                <Text style={styles.hyperlink}>
                  Corrected Metabolic Equivalents
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </KeyboardAwareScrollView>
          <View style={styles.saveBtnContainer}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                setValidOnChange(true);
                handleSubmit();
              }}
              disabled={!isValid || loadingSubmit}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
};
