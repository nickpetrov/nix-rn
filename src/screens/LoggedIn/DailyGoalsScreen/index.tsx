// utils
import React, {useRef} from 'react';
import * as yup from 'yup';

// components
import {View, Text, SafeAreaView} from 'react-native';
import {Formik, Field, FormikProps} from 'formik';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixInput} from 'components/NixInput';
import {NixButton} from 'components/NixButton';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as userActions from 'store/auth/auth.actions';

// styles
import {styles} from './DailyGoalsScreen.styles';
import {User} from 'store/auth/auth.types';

interface DailyGoalsScreenProps {}

export type DailyGoalsDataProps = Pick<
  User,
  'daily_kcal' | 'daily_carbs_pct' | 'daily_fat_pct' | 'daily_protein_pct'
>;

export const DailyGoalsScreen: React.FC<DailyGoalsScreenProps> = () => {
  const userData = useSelector(state => state.auth.userData);

  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<DailyGoalsDataProps>>(null);

  const goalsValidation = yup.object().shape({
    daily_kcal: yup
      .number()
      .label('Daily Calorie Limit must be a number')
      .integer('No decimals allowed for Daily Calorie Limit')
      .required('Daily calorie limit is required'),
    daily_carbs_pct: yup
      .number()
      .label('Must be a Number')
      .test({
        test: () => {
          return (
            parseFloat(formRef.current?.values.daily_carbs_pct || '0') +
              parseFloat(formRef.current?.values.daily_fat_pct || '0') +
              parseFloat(formRef.current?.values.daily_protein_pct || '0') <=
            100
          );
        },
        message: "Can't be more than 100% in total",
      }),
    daily_fat_pct: yup
      .number()
      .label('Must be a Number')
      .test({
        test: () => {
          return (
            parseFloat(formRef.current?.values.daily_carbs_pct || '0') +
              parseFloat(formRef.current?.values.daily_fat_pct || '0') +
              parseFloat(formRef.current?.values.daily_protein_pct || '0') <=
            100
          );
        },
        message: "Can't be more than 100% in total",
      }),
    daily_protein_pct: yup
      .number()
      .label('Must be a Number')
      .test({
        test: () => {
          return (
            parseFloat(formRef.current?.values.daily_carbs_pct || '0') +
              parseFloat(formRef.current?.values.daily_fat_pct || '0') +
              parseFloat(formRef.current?.values.daily_protein_pct || '0') <=
            100
          );
        },
        message: "Can't be more than 100% in total",
      }),
  });

  const handleUpdate = (values: DailyGoalsDataProps) => {
    const updatedGoals = {...values};
    let key: keyof typeof updatedGoals;
    for (key in updatedGoals) {
      updatedGoals[key] = updatedGoals[key]
        ? String(parseInt(updatedGoals[key] || ''))
        : null;
    }
    dispatch(userActions.updateUserData(updatedGoals));
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Formik
          initialValues={{
            daily_kcal: userData.daily_kcal ? userData.daily_kcal + '' : '',
            daily_carbs_pct: userData.daily_carbs_pct
              ? userData.daily_carbs_pct + ''
              : '',
            daily_fat_pct: userData.daily_fat_pct
              ? userData.daily_fat_pct + ''
              : '',
            daily_protein_pct: userData.daily_protein_pct
              ? userData.daily_protein_pct + ''
              : '',
          }}
          innerRef={formRef}
          onSubmit={values => handleUpdate(values)}
          validationSchema={goalsValidation}>
          {({handleSubmit, isValid, dirty}) => (
            <>
              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.textAlignRight, styles.fz16]}>
                    Daily Calorie Limit:
                  </Text>
                </View>
                <View style={styles.w50}>
                  <Field
                    component={NixInput}
                    name="daily_kcal"
                    label=""
                    style={styles.input}
                    leftComponent={
                      <FontAwesome
                        name={'fire'}
                        size={30}
                        style={styles.icon}
                      />
                    }
                    autoCapitalize="none"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.textAlignRight, styles.fz13]}>
                    Calories from
                  </Text>
                  <Text style={[styles.textAlignRight, styles.fz20]}>
                    Protein:
                  </Text>
                </View>
                <View style={styles.w50}>
                  <Field
                    component={NixInput}
                    name="daily_protein_pct"
                    label=""
                    style={styles.input}
                    rightComponent={
                      <FontAwesome
                        name={'percent'}
                        size={20}
                        style={styles.icon}
                      />
                    }
                    autoCapitalize="none"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.textAlignRight, styles.fz13]}>
                    Calories from
                  </Text>
                  <Text style={[styles.textAlignRight, styles.fz20]}>
                    Carbohydrates:
                  </Text>
                </View>
                <View style={styles.w50}>
                  <Field
                    component={NixInput}
                    name="daily_carbs_pct"
                    label=""
                    style={styles.input}
                    rightComponent={
                      <FontAwesome
                        name={'percent'}
                        size={20}
                        style={styles.icon}
                      />
                    }
                    autoCapitalize="none"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.textAlignRight, styles.fz13]}>
                    Calories from
                  </Text>
                  <Text style={[styles.textAlignRight, styles.fz20]}>Fat:</Text>
                </View>
                <View style={styles.w50}>
                  <Field
                    component={NixInput}
                    name="daily_fat_pct"
                    label=""
                    style={styles.input}
                    rightComponent={
                      <FontAwesome
                        name={'percent'}
                        size={20}
                        style={styles.icon}
                      />
                    }
                    autoCapitalize="none"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.footer}>
                <NixButton
                  title="Update"
                  onPress={handleSubmit}
                  type="primary"
                  disabled={!isValid || !dirty}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};
