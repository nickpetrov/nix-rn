// utils
import React, {useState, useRef, useLayoutEffect} from 'react';
import moment from 'moment-timezone';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Formik, Field, FormikProps} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {NixInputField} from 'components/NixInputField';
import {NixButton} from 'components/NixButton';
import {WebView} from 'react-native-webview';
import ModalSelector from 'react-native-modal-selector';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as authActions from 'store/auth/auth.actions';

// helpers
import {difference} from 'helpers/difference';
import * as NixCalc from 'helpers/nixCalculator';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './DailyCaloriesScreen.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {User} from 'store/auth/auth.types';
import {NavigationHeader} from 'components/NavigationHeader';

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
  const userData = useSelector(state => state.auth.userData);

  const [measureSystem, setMeasureSystem] = useState(userData.measure_system);
  const [daily_kcal] = useState(userData.daily_kcal + '');
  const [weight_kg] = useState(userData.weight_kg + '');
  const [weight_lb] = useState(Math.round(userData.weight_kg * 2.20462) + '');
  const [height_cm] = useState(userData.height_cm + '');
  const [height_ft] = useState(Math.floor(userData.height_cm / 30.48) + '');
  const [height_in] = useState((userData.height_cm % 30.48) / 2.54 + '');
  const [gender, setGender] = useState(userData.gender);
  const [birth_year] = useState(userData.birth_year + '');
  const [age] = useState(moment().year() - userData.birth_year + '');
  const [modalWebViewUrl, setModalWebViewUrl] = useState('');

  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormikDataProps>>(null);

  const submitHandler = (values: FormikDataProps) => {
    const newUserData = {
      ...values,
      weight_kg: +values.weight_kg,
      height_cm: +values.height_cm,
      birth_year: +values.birth_year,
      daily_kcal: +values.daily_kcal,
    };

    const diff: Array<keyof FormikDataProps> = difference(
      formRef.current?.initialValues,
      formRef.current?.values,
    );

    if (diff.length) {
      newUserData.birth_year =
        moment().year() - parseInt(newUserData.age || '0');

      if (newUserData.measure_system === 0) {
        newUserData.weight_kg = parseFloat(
          String(newUserData.weight_lb ? +newUserData.weight_lb : 1 / 2.20462),
        );
        newUserData.height_cm = Math.round(
          parseFloat(String(newUserData.height_ft)) * 30.48 +
            parseFloat(String(newUserData.height_in)) * 2.54,
        );
      }

      newUserData.weight_kg = parseFloat(String(newUserData.weight_kg));

      newUserData.height_cm = parseFloat(String(newUserData.height_cm));

      newUserData.measure_system = parseInt(String(newUserData.measure_system));

      newUserData.daily_kcal = parseInt(String(newUserData.daily_kcal));

      console.log(JSON.stringify(newUserData));

      delete newUserData.weight_lb;
      delete newUserData.height_ft;
      delete newUserData.height_in;
      delete newUserData.age;

      dispatch(authActions.updateUserData(newUserData as Partial<User>)).then(
        () => {
          navigation.navigate(Routes.Dashboard);
        },
      );
    }
  };

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

  const FormikInitValues: FormikDataProps = {
    measure_system: measureSystem,
    weight_kg,
    height_cm,
    height_ft,
    height_in: String(Math.round(parseFloat(String(height_in)))),
    weight_lb,
    gender,
    birth_year,
    daily_kcal,
    age: age,
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAwareScrollView style={styles.container}>
        <Formik
          initialValues={FormikInitValues}
          innerRef={formRef}
          onSubmit={values => submitHandler(values)}
          // validationSchema={}
          validateOnMount>
          {({handleSubmit, setFieldValue, isValid, values, dirty}) => (
            <>
              <View style={styles.fields}>
                <ModalSelector
                  data={[
                    {
                      label: 'Metric',
                      value: 1,
                    },
                    {
                      label: 'Imperial',
                      value: 0,
                    },
                  ]}
                  initValue={measureSystem + ''}
                  onChange={option => {
                    setFieldValue('measure_system', option.value);
                    setMeasureSystem(option.value);
                  }}
                  listType="FLATLIST"
                  keyExtractor={(item: {label: string; value: number}) =>
                    String(item.value)
                  }>
                  <Field
                    component={NixInputField}
                    value={values.measure_system === 1 ? 'Metric' : 'Imperial'}
                    name="measure_system"
                    label="Measure system"
                    style={{
                      paddingHorizontal: 5,
                      borderColor: '#666',
                      borderWidth: 2,
                      borderRadius: 10,
                      marginHorizontal: 10,
                      marginBottom: 10,
                    }}
                    leftComponent={
                      <FontAwesome5
                        name={'ruler-vertical'}
                        size={30}
                        style={{
                          marginRight: 15,
                          marginBottom: 2,
                          color: '#666',
                        }}
                      />
                    }
                    disabled
                  />
                </ModalSelector>

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
                  initValue={gender}
                  onChange={option => {
                    setFieldValue('gender', option.value);
                    setGender(option.value);
                  }}
                  listType="FLATLIST"
                  keyExtractor={(item: {label: string; value: string}) =>
                    item.value
                  }>
                  <Field
                    component={NixInputField}
                    name="gender"
                    label="Gender"
                    style={{
                      paddingHorizontal: 5,
                      borderColor: '#666',
                      borderWidth: 2,
                      borderRadius: 10,
                      marginHorizontal: 10,
                      marginBottom: 10,
                    }}
                    leftComponent={
                      <FontAwesome
                        name={'user'}
                        size={30}
                        style={{
                          marginRight: 15,
                          marginBottom: 2,
                          color: '#666',
                        }}
                      />
                    }
                    disabled
                  />
                </ModalSelector>
                {measureSystem === 1 ? (
                  <>
                    <Field
                      component={NixInputField}
                      name="weight_kg"
                      label="Weight"
                      style={styles.input}
                      leftComponent={
                        <FontAwesome5
                          name={'weight-hanging'}
                          size={30}
                          style={{
                            marginRight: 15,
                            marginBottom: 2,
                            color: '#666',
                          }}
                        />
                      }
                      rightComponent={<Text>kg</Text>}
                      autoCapitalize="none"
                      keyboardType="numeric"
                    />
                    <Field
                      component={NixInputField}
                      name="height_cm"
                      label="Height"
                      style={styles.input}
                      leftComponent={
                        <FontAwesome5
                          name={'ruler-vertical'}
                          size={30}
                          style={{
                            marginRight: 15,
                            marginBottom: 2,
                            color: '#666',
                          }}
                        />
                      }
                      autoCapitalize="none"
                      rightComponent={<Text>cm</Text>}
                      keyboardType="numeric"
                    />
                  </>
                ) : (
                  <>
                    <Field
                      component={NixInputField}
                      name="weight_lb"
                      label="Weight"
                      style={styles.input}
                      leftComponent={
                        <FontAwesome5
                          name={'weight-hanging'}
                          size={30}
                          style={{
                            marginRight: 15,
                            marginBottom: 2,
                            color: '#666',
                          }}
                        />
                      }
                      rightComponent={<Text>lbs</Text>}
                      autoCapitalize="none"
                      keyboardType="numeric"
                    />
                    <Field
                      component={NixInputField}
                      name="height_ft"
                      label="Height"
                      style={styles.input}
                      leftComponent={
                        <FontAwesome5
                          name={'ruler-vertical'}
                          size={30}
                          style={{
                            marginRight: 15,
                            marginBottom: 2,
                            color: '#666',
                          }}
                        />
                      }
                      rightComponent={<Text>ft</Text>}
                      autoCapitalize="none"
                      keyboardType="numeric"
                    />
                    <Field
                      component={NixInputField}
                      name="height_in"
                      label="Height"
                      style={styles.input}
                      leftComponent={
                        <FontAwesome5
                          name={'ruler-vertical'}
                          size={30}
                          style={{
                            marginRight: 15,
                            marginBottom: 2,
                            color: '#666',
                          }}
                        />
                      }
                      rightComponent={<Text>in</Text>}
                      autoCapitalize="none"
                      keyboardType="numeric"
                    />
                  </>
                )}
                <Field
                  component={NixInputField}
                  name="age"
                  label="Age"
                  style={styles.input}
                  leftComponent={
                    <FontAwesome
                      name={'calendar'}
                      size={30}
                      style={{marginRight: 15, marginBottom: 2, color: '#666'}}
                    />
                  }
                  autoCapitalize="none"
                  keyboardType="numeric"
                  onValueChange={(newVal: number) => {
                    setFieldValue('birth_year', moment().year() - newVal);
                  }}
                />
              </View>
              <View style={styles.panel}>
                <View style={styles.panelHeader}>
                  <Text>Recommended Calories</Text>
                </View>
                <View style={styles.panelBody}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Text style={styles.recommendedKcal}>
                      {NixCalc.calculateRecommendedCalories(
                        values.gender || 'female',
                        values.weight_kg,
                        values.height_cm,
                        values.age,
                        2,
                      )}
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
                      {NixCalc.calculateRecommendedCalories(
                        values.gender || 'female',
                        values.weight_kg,
                        values.height_cm,
                        values.age,
                        2,
                      ) - 500}
                    </Text>
                    <Text>
                      Lose {values.measure_system === 1 ? '~0.5 kg' : '~1 lb'}{' '}
                      per week
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.recommendedKcal}>
                      {NixCalc.calculateRecommendedCalories(
                        values.gender || 'female',
                        values.weight_kg,
                        values.height_cm,
                        values.age,
                        2,
                      ) + 500}
                    </Text>
                    <Text>
                      Gain {values.measure_system === 1 ? '~0.5 kg' : '~1 lb'}{' '}
                      per week
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.panel}>
                <View style={styles.panelHeader}>
                  <Text>Enter daily calorie limit: </Text>
                </View>
                <View style={styles.panelBody}>
                  <Field
                    component={NixInputField}
                    name="daily_kcal"
                    label="My Daily Calorie Limit"
                    style={styles.input}
                    leftComponent={
                      <FontAwesome
                        name={'fire'}
                        size={30}
                        style={{
                          marginRight: 15,
                          marginBottom: 2,
                          color: '#666',
                        }}
                      />
                    }
                    autoCapitalize="none"
                    keyboardType="numeric"
                    onValueChange={(newVal: number) => {
                      setFieldValue('birth_year', moment().year() - newVal);
                    }}
                  />
                </View>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Disclaimer: </Text>
                  This information is for use in adults defined as individuals
                  18 years of age or older and not by younger people, or
                  pregnant or breastfeeding women.This information is not
                  intended to provide medical advice.A health care provider who
                  has examined you and knows your medical history is the best
                  person to diagnose and treat your health problem. If you have
                  specific health questions, please consult your health care
                  provider.Calorie calculations are based on the Harris Benedict
                  equation, and corrected MET values are provided as referenced
                  at these sources:
                </Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setModalWebViewUrl(
                      'https://sites.google.com/site/compendiumofphysicalactivities/corrected-mets',
                    );
                  }}>
                  <Text style={styles.hyperlink}>
                    Compendium of Physical Activities
                  </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setModalWebViewUrl(
                      'http://www.umass.edu/physicalactivity/newsite/publications/Sarah%20Keadle/papers/1.pdf',
                    );
                  }}>
                  <Text style={styles.hyperlink}>
                    Corrected Metabolic Equivalents
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={{marginBottom: 50}}>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                    position: 'absolute',
                    width: '50%',
                  }}>
                  <NixButton
                    title="Sumbit"
                    onPress={handleSubmit}
                    type="primary"
                    disabled={!isValid || !dirty}
                  />
                </View>
              </View>
            </>
          )}
        </Formik>
        {modalWebViewUrl.length ? (
          <View
            style={{
              position: 'absolute',
              flex: 1,
              top: 0,
              left: 0,
              width: '100%',
            }}>
            <TouchableOpacity>
              <FontAwesome name="close" />
            </TouchableOpacity>
            <WebView style={{flex: 1}} source={{uri: modalWebViewUrl}} />
          </View>
        ) : null}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
