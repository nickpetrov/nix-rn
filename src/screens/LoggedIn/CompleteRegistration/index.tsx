// utils
import React, {useState, useEffect} from 'react';

// components
import {Formik, Field} from 'formik';
import {Text, View, SafeAreaView, Linking, Switch} from 'react-native';
import {NixButton} from 'components/NixButton';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NavigationHeader} from 'components/NavigationHeader';
import NixCheckbox from 'components/NixCheckbox';
import {NixInput} from 'components/NixInput';

// validation
import step2ValidationSchema from './validation';

// constants
import {Routes} from 'navigation/Routes';

// hooks
import {useDispatch, useSelector} from 'hooks';

// ssrvices
import authService from 'api/authService';
import baseService from 'api/baseService';

// actions
import {updateUserData} from 'store/auth/auth.actions';
import {setInfoMessage} from 'store/base/base.actions';

// styles
import {styles} from './CompleteRegistration.styles';
import {Colors} from 'constants/Colors';

// types
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {NutritionType} from 'api/baseService/types';
import {StackNavigatorParamList} from 'navigation/navigation.types';

type Props = {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.CompleteRegistration
  >;
};

type FormikProps = {
  nutrition_topics: number[];
  isAgreedTerms: boolean;
  isConfirmedThirteen: boolean;
  weekday_reminders_enabled: boolean;
  weekend_reminders_enabled: boolean;
  showEmail: boolean;
  email: string;
};

const CompleteRegistration: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector(state => state.auth.userData);

  const [selectedTopics, setSelectedTopics] = useState<Array<number>>([]);
  const [nutritionTopicsList, setNutritionTopicsList] = useState<
    Array<{
      name: string;
      id: number;
      children: Array<NutritionType>;
    }>
  >([{name: 'Nutrition Topics', id: 0, children: []}]);

  useEffect(() => {
    try {
      const fetchTopics = async () => {
        const response = await baseService.getNutrionTopics();
        const responseData = response.data;
        const itemsList = responseData.topics ? [...responseData.topics] : [];
        setNutritionTopicsList([
          {name: 'Nutrition Topics', id: 0, children: itemsList},
        ]);
      };
      fetchTopics();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader {...props} emptyRight navigation={navigation} />
      ),
    });
  }, [navigation]);

  const FormikInitValues: FormikProps = {
    nutrition_topics: [],
    isAgreedTerms: false,
    isConfirmedThirteen: false,
    weekday_reminders_enabled: false,
    weekend_reminders_enabled: false,
    showEmail: !userData.email,
    email: '',
  };

  const step2Handler = (form: FormikProps) => {
    setIsLoading(true);
    if (form.email) {
      authService
        .sendEmailVerification(form.email)
        .then(() => {
          return dispatch(
            updateUserData({
              nutrition_topics: form.nutrition_topics,
              weekday_reminders_enabled: form.weekday_reminders_enabled ? 1 : 0,
              weekend_reminders_enabled: form.weekend_reminders_enabled ? 1 : 0,
              push_enabled:
                form.weekday_reminders_enabled && form.weekend_reminders_enabled
                  ? 1
                  : 0,
            }),
          );
        })
        .then(() => {
          return dispatch(updateUserData({daily_kcal: 2000}));
        })
        .then(() => {
          setIsLoading(false);
          navigation.replace(Routes.Dashboard, {
            justLoggedIn: true,
          });
        })
        .catch(err => {
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
          setIsLoading(false);
        });
    } else {
      dispatch(
        updateUserData({
          nutrition_topics: form.nutrition_topics,
          weekday_reminders_enabled: form.weekday_reminders_enabled ? 1 : 0,
          weekend_reminders_enabled: form.weekend_reminders_enabled ? 1 : 0,
          push_enabled:
            form.weekday_reminders_enabled && form.weekend_reminders_enabled
              ? 1
              : 0,
        }),
      )
        .then(() => {
          return dispatch(updateUserData({daily_kcal: 2000}));
        })
        .then(() => {
          setIsLoading(false);
          navigation.replace(Routes.Dashboard, {
            justLoggedIn: true,
          });
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraHeight={200}
      style={styles.keyboardView}>
      <SafeAreaView style={styles.loginWrapper}>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Optional Settings</Text>
          <Formik
            initialValues={FormikInitValues}
            onSubmit={values => step2Handler(values)}
            validationSchema={step2ValidationSchema}
            validateOnMount>
            {({
              handleSubmit,
              isValid,
              values,
              setFieldValue,
              errors,
              handleChange,
              handleBlur,
            }) => (
              <>
                <View>
                  {!userData.email && (
                    <NixInput
                      rootStyles={styles.inputRoot}
                      labelContainerStyle={styles.labelContainer}
                      label="Email"
                      placeholder="Email"
                      value={values.email || ''}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      error={errors.email}
                      withoutErorrText
                      withErrorBorder
                    />
                  )}
                  <View style={styles.itemPN}>
                    <View style={styles.leftPN}>
                      <Text style={styles.titlePN}>
                        Weekday Push Notifications
                      </Text>
                      <Text>
                        If enabled, we send a push alert at 9PM on any weekday
                        (Mon-Fri) when you forget to log your foods.
                      </Text>
                    </View>
                    <View>
                      <Switch
                        value={values.weekday_reminders_enabled}
                        onValueChange={value =>
                          setFieldValue('weekday_reminders_enabled', value)
                        }
                        style={styles.switch}
                        trackColor={{
                          false: Colors.LightGray,
                          true: Colors.LightGreen,
                        }}
                        thumbColor={'#fff'}
                        ios_backgroundColor="#fff"
                      />
                    </View>
                  </View>
                  <View style={styles.itemPN}>
                    <View style={styles.leftPN}>
                      <Text style={styles.titlePN}>
                        Weekend Push Notifications
                      </Text>
                      <Text>
                        If enabled, we send a push alert at 9PM on any weekend
                        (Sat-Sun) when you forget to log your foods.
                      </Text>
                    </View>
                    <View>
                      <Switch
                        value={values.weekend_reminders_enabled}
                        onValueChange={value =>
                          setFieldValue('weekend_reminders_enabled', value)
                        }
                        style={styles.switch}
                        trackColor={{
                          false: Colors.LightGray,
                          true: Colors.LightGreen,
                        }}
                        thumbColor={'#fff'}
                        ios_backgroundColor="#fff"
                      />
                    </View>
                  </View>
                  <Text style={styles.selectHeader}>
                    Which nutrition topics do you follow?
                  </Text>
                  <SectionedMultiSelect
                    items={nutritionTopicsList}
                    // @ts-ignore
                    IconRenderer={Icon}
                    uniqueKey="id"
                    subKey="children"
                    selectText="Pick Topicks"
                    styles={{
                      chipsWrapper: styles.chipsWrapper,
                      selectToggle: styles.selectToggle,
                      selectToggleText: styles.selectToggleText,
                      toggleIcon: {display: 'none'},
                    }}
                    selectToggleIconComponent={<></>}
                    alwaysShowSelectText
                    modalWithSafeAreaView
                    showDropDowns={false}
                    readOnlyHeadings={true}
                    onSelectedItemsChange={selectedItems => {
                      console.log(selectedItems);
                      setFieldValue('nutrition_topics', selectedItems);
                      setSelectedTopics([...selectedItems]);
                    }}
                    selectedItems={selectedTopics}
                    hideSearch={true}
                  />
                </View>
                <View style={[styles.checkBoxContainer, styles.borderTop]}>
                  <Field
                    component={NixCheckbox}
                    name="isAgreedTerms"
                    textComponent={
                      <View style={{paddingHorizontal: 18}}>
                        <Text style={{fontSize: 14, color: '#757575'}}>
                          I agree to Nutritionix Track{' '}
                          <Text
                            style={styles.link}
                            onPress={() =>
                              Linking.openURL(
                                'https://www.nutritionix.com/terms',
                              )
                            }>
                            Terms of Service
                          </Text>{' '}
                          and{' '}
                          <Text
                            style={styles.link}
                            onPress={() =>
                              Linking.openURL(
                                'https://www.nutritionix.com/privacy',
                              )
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
                      textDecorationLine: 'none',
                      fontSize: 14,
                    }}
                  />
                </View>
                <NixButton
                  style={{
                    alignSelf: 'center',
                    padding: 12,
                    marginTop: 20,
                    height: 45,
                    width: '95%'
                  }}
                  title="Start Logging Foods!"
                  onPress={handleSubmit}
                  type="primary"
                  disabled={
                    !isValid ||
                    isLoading ||
                    !values.isAgreedTerms ||
                    !values.isConfirmedThirteen
                  }
                />
              </>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default CompleteRegistration;
