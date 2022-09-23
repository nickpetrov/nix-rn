// utils
import React, {useState, useEffect, useRef} from 'react';
import * as yup from 'yup';
import moment from 'moment-timezone';

// components
import {View, Text, ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Formik, Field, FormikProps} from 'formik';
import {NixInput} from 'components/NixInput';
import {NixButton} from 'components/NixButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Picker} from '@react-native-picker/picker';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as userActions from 'store/auth/auth.actions';

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
  const userData = useSelector(state => state.auth.userData);

  const [firstName] = useState(userData.first_name);
  const [lastName] = useState(userData.last_name || undefined);
  const [timezone, setTimezone] = useState(userData.timezone);
  const [timezoneList, setTimezoneList] = useState<
    {label: string; value: string}[]
  >([]);
  const [measureSystem, setMeasureSystem] = useState(userData.measure_system);
  const [weight_kg, setWeightKg] = useState(String(userData.weight_kg));
  const [weight_lb, setWeightLb] = useState(
    String(Math.round(parseFloat(userData.weight_kg) * 2.20462)),
  );
  const [height_cm] = useState(String(userData.height_cm));
  const [height_ft] = useState(
    String(Math.floor(parseFloat(userData.height_cm) / 30.48)),
  );
  const [height_in] = useState(
    String((parseFloat(userData.height_cm) % 30.48) / 2.54),
  );
  const [birth_year] = useState(userData.birth_year);
  const [age] = useState(String(moment().year() - userData.birth_year));

  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormikDataProps>>(null);

  useEffect(() => {
    const timezones = moment.tz.names().map(tz => {
      return {
        label: tz,
        value: tz,
      };
    });
    setTimezoneList(timezones);
  }, []);

  const preferencesValidationSchema = yup.object().shape({
    // first_name: yup
    //   .string()
    //   .required('First Name is required')
    //   .min(2, ({ min }) => `First Name must be at least ${min} characters`),
    // last_name: yup
    //   .string()
    //   .min(2, ({ min }) => `First Name must be at least ${min} characters`),
    // timezone: yup
    //   .string()
    //   .required('Timezone is required'),
    // measure_system: yup
    //   .string()
    //   .required('Measure System is required'),
    // weight: yup
    //   .string()
    //   .required('Weight is required')
    //   .min(2, ({ min }) => `First Name must be at least ${min} characters`),
    // height: yup
    //   .string()
    //   .required('First Name is required')
    //   .min(2, ({ min }) => `First Name must be at least ${min} characters`),
    // age: yup
    //   .string()
    //   .required('First Name is required')
    //   .min(2, ({ min }) => `First Name must be at least ${min} characters`),
  });

  useEffect(() => {
    if (measureSystem === 1) {
      //convert imperial to metric
      const kgFromLbs = String(
        Math.round(parseFloat(String(weight_lb)) / 2.20462),
      );
      setWeightKg(kgFromLbs);
      if (formRef.current?.values.weight_kg) {
        formRef.current.setFieldValue('weight_kg', kgFromLbs);
        // formRef.current.values.weight_kg = kgFromLbs;
      }
    } else {
      //convert metric to imperial
      const lbFromKg = String(Math.round(parseFloat(weight_kg) * 2.20462));
      setWeightLb(lbFromKg);
      if (formRef.current?.values.weight_lb) {
        formRef.current.setFieldValue('weight_lb', lbFromKg);
        // formRef.current.values.weight_lb = lbFromKg;
      }
    }
  }, [measureSystem, weight_lb, weight_kg, formRef]);

  const submitHandler = (values: FormikDataProps) => {
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
      console.log(newUserData.measure_system == 0);
      console.log(newUserData.weight_lb);
      if (newUserData.measure_system == 0) {
        newUserData.weight_kg = parseFloat(
          String(
            (newUserData.weight_lb ? +newUserData.weight_lb : 1) / 2.20462,
          ),
        );
        console.log(newUserData.weight_kg);
        newUserData.height_cm = Math.round(
          parseFloat(String(newUserData.height_ft)) * 30.48 +
            parseFloat(String(newUserData.height_in)) * 2.54,
        );
      }
      console.log(newUserData.weight_kg);
      newUserData.weight_kg = parseFloat(String(newUserData.weight_kg));

      newUserData.height_cm = parseFloat(String(newUserData.height_cm));

      newUserData.measure_system = parseInt(String(newUserData.measure_system));

      delete newUserData.weight_lb;
      delete newUserData.height_ft;
      delete newUserData.height_in;
      delete newUserData.age;

      dispatch(userActions.updateUserData(newUserData as Partial<User>)).then(
        () => {
          navigation.navigate(Routes.Dashboard);
        },
      );
    }
  };

  const FormikInitValues: FormikDataProps = {
    first_name: firstName,
    last_name: lastName,
    timezone: timezone,
    measure_system: measureSystem,
    weight_kg,
    height_cm,
    height_ft,
    height_in: String(Math.round(parseFloat(String(height_in)))),
    weight_lb,
    birth_year,
    age: age,
  };

  return (
    <KeyboardAwareScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1}}>
        <ScrollView>
          <Formik
            initialValues={FormikInitValues}
            innerRef={formRef}
            onSubmit={values => submitHandler(values)}
            validationSchema={preferencesValidationSchema}
            validateOnMount>
            {({handleSubmit, setFieldValue, isValid, dirty}) => {
              return (
                <>
                  <Field
                    component={NixInput}
                    name="first_name"
                    label="First Name"
                    style={styles.input}
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
                    autoCapitalize="none"
                  />
                  <Field
                    component={NixInput}
                    name="last_name"
                    label="Last Name"
                    style={styles.input}
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
                    autoCapitalize="none"
                  />
                  <View
                    style={{
                      paddingHorizontal: 5,
                      borderColor: '#666',
                      borderWidth: 2,
                      borderRadius: 10,
                      marginHorizontal: 10,
                      marginBottom: 10,
                    }}>
                    <Picker
                      style={{
                        width: '100%',
                        minWidth: '100%',
                      }}
                      itemStyle={{}}
                      selectedValue={timezone}
                      onValueChange={newVal => {
                        setFieldValue('timezone', newVal);
                        setTimezone(newVal);
                      }}>
                      {timezoneList.map(
                        (item: {label: string; value: string}) => (
                          <Picker.Item
                            key={item.value}
                            label={item.label}
                            value={item.value}
                          />
                        ),
                      )}
                    </Picker>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 5,
                      borderColor: '#666',
                      borderWidth: 2,
                      borderRadius: 10,
                      marginHorizontal: 10,
                    }}>
                    <Picker
                      style={{
                        width: '100%',
                        minWidth: '100%',
                        paddingHorizontal: 12,
                      }}
                      selectedValue={measureSystem}
                      onValueChange={newVal => {
                        setFieldValue('measure_system', newVal);
                        setMeasureSystem(newVal);
                      }}>
                      {[
                        {
                          label: 'Metric',
                          value: 1,
                        },
                        {
                          label: 'Imperial',
                          value: 0,
                        },
                      ].map((item: {label: string; value: number}) => (
                        <Picker.Item
                          key={item.value}
                          label={item.label}
                          value={item.value}
                        />
                      ))}
                    </Picker>
                  </View>
                  {measureSystem === 1 ? (
                    <>
                      <Field
                        component={NixInput}
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
                        component={NixInput}
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
                        component={NixInput}
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
                        component={NixInput}
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
                        component={NixInput}
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
                    component={NixInput}
                    name="age"
                    label="Age"
                    style={styles.input}
                    leftComponent={
                      <FontAwesome
                        name={'calendar'}
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
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, marginHorizontal: 8}}>
                      <NixButton title="Reset Password" />
                    </View>
                    <View style={{flex: 1, marginHorizontal: 8}}>
                      <NixButton title="Change email" />
                    </View>
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
              );
            }}
          </Formik>
        </ScrollView>
      </View>
    </KeyboardAwareScrollView>
  );
};
