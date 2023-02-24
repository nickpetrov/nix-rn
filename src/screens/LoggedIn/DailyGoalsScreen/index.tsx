// utils
import React, {useRef, useLayoutEffect, useState} from 'react';
import * as yup from 'yup';

// helpers
import {analyticTrackEvent} from 'helpers/analytics.ts';
import {replaceRegexForNumber} from 'helpers/index';

// components
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import {Formik, FormikProps} from 'formik';
import {NixInput} from 'components/NixInput';
import {NixButton} from 'components/NixButton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {NavigationHeader} from 'components/NavigationHeader';
import ShakeView from 'components/ShakeView';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import {useNetInfo} from '@react-native-community/netinfo';

// actions
import * as userActions from 'store/auth/auth.actions';
import {setInfoMessage} from 'store/base/base.actions';

// styles
import {styles} from './DailyGoalsScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {User} from 'store/auth/auth.types';
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {TouchableWithoutFeedback} from 'react-native';

interface DailyGoalsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.DailyGoals
  >;
}

export type DailyGoalsDataProps = Pick<
  User,
  'daily_kcal' | 'daily_carbs_pct' | 'daily_fat_pct' | 'daily_protein_pct'
>;

export const DailyGoalsScreen: React.FC<DailyGoalsScreenProps> = ({
  navigation,
}) => {
  const inputRefs = useRef<{[key: string]: TextInput | null}>({});
  const userData = useSelector(state => state.auth.userData);
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<DailyGoalsDataProps>>(null);
  const [isLoading, setIsLoading] = useState(false);

  const goalsValidation = yup.object().shape({
    daily_kcal: yup
      .number()
      .label('Daily Calorie Limit must be a number')
      .integer('No decimals allowed for Daily Calorie Limit')
      .required('Daily calorie limit is required'),
    daily_carbs_pct: yup
      .number()
      .min(0, 'Value should be greater or equal to 0')
      .max(100)
      .label('Must be a Number')
      .test({
        test: () => {
          return (
            parseFloat((formRef.current?.values.daily_carbs_pct || '0') + '') +
              parseFloat((formRef.current?.values.daily_fat_pct || '0') + '') +
              parseFloat(
                (formRef.current?.values.daily_protein_pct || '0') + '',
              ) <=
            100
          );
        },
        message: "Can't be more than 100% in total",
      }),
    daily_fat_pct: yup
      .number()
      .min(0, 'Value should be greater or equal to 0')
      .max(100)
      .label('Must be a Number')
      .test({
        test: () => {
          return (
            parseFloat((formRef.current?.values.daily_carbs_pct || '0') + '') +
              parseFloat((formRef.current?.values.daily_fat_pct || '0') + '') +
              parseFloat(
                (formRef.current?.values.daily_protein_pct || '0') + '',
              ) <=
            100
          );
        },
        message: "Can't be more than 100% in total",
      }),
    daily_protein_pct: yup
      .number()
      .min(0, 'Value should be greater or equal to 0')
      .max(100)
      .label('Must be a Number')
      .test({
        test: () => {
          return (
            parseFloat((formRef.current?.values.daily_carbs_pct || '0') + '') +
              parseFloat((formRef.current?.values.daily_fat_pct || '0') + '') +
              parseFloat(
                (formRef.current?.values.daily_protein_pct || '0') + '',
              ) <=
            100
          );
        },
        message: "Can't be more than 100% in total",
      }),
  });

  const handleUpdate = (values: DailyGoalsDataProps) => {
    if (!netInfo.isConnected) {
      dispatch(
        setInfoMessage({
          title: 'Not available in offline mode.',
          btnText: 'Ok',
        }),
      );
    } else {
      setIsLoading(true);
      const updatedGoals = {...values};
      let key: keyof typeof updatedGoals;
      for (key in updatedGoals) {
        updatedGoals[key] = updatedGoals[key]
          ? parseInt(updatedGoals[key] + '' || '')
          : null;
      }

      dispatch(userActions.updateUserData(updatedGoals))
        .then(() => {
          setIsLoading(false);
          navigation.goBack();
        })
        .catch(() => {
          setIsLoading(false);
        });

      if (updatedGoals.daily_kcal !== userData.daily_kcal) {
        analyticTrackEvent(
          'changedCalorieLimit',
          'From ' + userData.daily_kcal + ' to ' + updatedGoals.daily_kcal,
        );
      }
      if (
        updatedGoals.daily_carbs_pct !== userData.daily_carbs_pct ||
        updatedGoals.daily_protein_pct !== userData.daily_protein_pct ||
        updatedGoals.daily_fat_pct !== userData.daily_fat_pct
      ) {
        analyticTrackEvent(
          'changedDailyGoals',
          'protein:' +
            updatedGoals.daily_protein_pct +
            '% carbs:' +
            updatedGoals.daily_carbs_pct +
            '% fat:' +
            updatedGoals.daily_fat_pct +
            '%',
        );
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader
          {...props}
          navigation={navigation}
          headerRight={
            <TouchableOpacity
              style={styles.question}
              onPress={() =>
                navigation.navigate(Routes.WebView, {
                  url: 'https://help.nutritionix.com/articles/11429-q-what-are-macro-goals-and-how-do-i-use-them-in-track',
                })
              }>
              <FontAwesome5 size={15} color={'white'} name="question" />
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={styles.container}>
          <Formik
            initialValues={{
              daily_kcal: userData.daily_kcal ? userData.daily_kcal : 0,
              daily_carbs_pct: userData.daily_carbs_pct
                ? userData.daily_carbs_pct
                : 0,
              daily_fat_pct: userData.daily_fat_pct
                ? userData.daily_fat_pct
                : 0,
              daily_protein_pct: userData.daily_protein_pct
                ? userData.daily_protein_pct
                : 0,
            }}
            innerRef={formRef}
            onSubmit={values => handleUpdate(values)}
            validationSchema={goalsValidation}
            validateOnBlur={false}>
            {({
              handleSubmit,
              setFieldValue,
              handleBlur,
              isValid,
              dirty,
              values,
              errors,
            }) => (
              <View>
                <NixInput
                  selectTextOnFocus
                  label="Daily Calorie Limit:"
                  labelStyle={styles.label}
                  labelContainerStyle={styles.labelContainerStyle}
                  style={styles.input}
                  value={(values.daily_kcal || '') + ''}
                  unit="kcal"
                  unitStyle={styles.unit}
                  onChangeText={val =>
                    setFieldValue('daily_kcal', replaceRegexForNumber(val))
                  }
                  onBlur={handleBlur('daily_kcal')}
                  keyboardType="numeric"
                  placeholder="0"
                  withErrorBorder
                  error={errors.daily_kcal}
                  withoutErorrText
                  editable={!isLoading}
                  returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                  ref={ref => (inputRefs.current.daily_kcal = ref)}
                  onSubmitEditing={() => {
                    const nextRef = inputRefs.current.daily_carbs_pct;
                    if (nextRef) {
                      nextRef?.focus();
                    }
                  }}
                  blurOnSubmit={false}
                />

                <NixInput
                  selectTextOnFocus
                  subLabel="% of Calories from"
                  label="Carbohydrates:"
                  labelStyle={styles.label}
                  labelContainerStyle={styles.labelContainerStyle}
                  style={styles.input}
                  value={(values.daily_carbs_pct || '') + ''}
                  unit="%"
                  unitValue={`${(
                    (((values.daily_kcal || 0) / 100) *
                      (values.daily_carbs_pct || 0)) /
                    4
                  ).toFixed(1)}g`}
                  unitStyle={{...styles.unit, ...styles.smallUnit}}
                  onChangeText={val =>
                    setFieldValue('daily_carbs_pct', replaceRegexForNumber(val))
                  }
                  onBlur={handleBlur('daily_carbs_pct')}
                  keyboardType="numeric"
                  placeholder="0"
                  withErrorBorder
                  error={errors.daily_carbs_pct}
                  withoutErorrText
                  editable={!isLoading}
                  returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                  ref={ref => (inputRefs.current.daily_carbs_pct = ref)}
                  onSubmitEditing={() => {
                    const nextRef = inputRefs.current.daily_protein_pct;
                    if (nextRef) {
                      nextRef?.focus();
                    }
                  }}
                  blurOnSubmit={false}
                />

                <NixInput
                  selectTextOnFocus
                  subLabel="% of Calories from"
                  label="Protein:"
                  labelStyle={styles.label}
                  labelContainerStyle={styles.labelContainerStyle}
                  style={styles.input}
                  value={(values.daily_protein_pct || '') + ''}
                  unit="%"
                  unitValue={`${(
                    (((values.daily_kcal || 0) / 100) *
                      (values.daily_protein_pct || 0)) /
                    4
                  ).toFixed(1)}g`}
                  unitStyle={{...styles.unit, ...styles.smallUnit}}
                  onChangeText={val =>
                    setFieldValue(
                      'daily_protein_pct',
                      replaceRegexForNumber(val),
                    )
                  }
                  onBlur={handleBlur('daily_protein_pct')}
                  keyboardType="numeric"
                  placeholder="0"
                  withErrorBorder
                  error={errors.daily_protein_pct}
                  withoutErorrText
                  editable={!isLoading}
                  returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                  ref={ref => (inputRefs.current.daily_protein_pct = ref)}
                  onSubmitEditing={() => {
                    const nextRef = inputRefs.current.daily_fat_pct;
                    if (nextRef) {
                      nextRef?.focus();
                    }
                  }}
                  blurOnSubmit={false}
                />

                <NixInput
                  selectTextOnFocus
                  subLabel="% of Calories from"
                  label="Fat:"
                  labelStyle={styles.label}
                  labelContainerStyle={styles.labelContainerStyle}
                  style={styles.input}
                  value={(values.daily_fat_pct || '') + ''}
                  unit="%"
                  unitValue={`${(
                    (((values.daily_kcal || 0) / 100) *
                      (values.daily_fat_pct || 0)) /
                    9
                  ).toFixed(1)}g`}
                  unitStyle={{...styles.unit, ...styles.smallUnit}}
                  onChangeText={val =>
                    setFieldValue('daily_fat_pct', replaceRegexForNumber(val))
                  }
                  onBlur={handleBlur('daily_fat_pct')}
                  keyboardType="numeric"
                  returnKeyType={Platform.OS === 'ios' ? 'done' : 'default'}
                  placeholder="0"
                  withErrorBorder
                  error={errors.daily_fat_pct}
                  withoutErorrText
                  editable={!isLoading}
                  ref={ref => (inputRefs.current.daily_fat_pct = ref)}
                />
                {Object.values(errors).some(item => item) && (
                  <View style={styles.errorView}>
                    <Text style={styles.error}>
                      {errors.daily_kcal ||
                        errors.daily_carbs_pct ||
                        errors.daily_protein_pct ||
                        errors.daily_fat_pct}
                    </Text>
                  </View>
                )}
                <View style={styles.footer}>
                  <ShakeView animated={!isValid}>
                    <NixButton
                      title="Save"
                      onPress={handleSubmit}
                      type="primary"
                      disabled={!isValid || !dirty || isLoading}
                    />
                  </ShakeView>
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
