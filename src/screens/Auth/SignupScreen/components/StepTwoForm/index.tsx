// utils
import React, {useState, useEffect} from 'react';

// components
import {Field, Formik} from 'formik';
import {ActivityIndicator, Text, View} from 'react-native';
import {NixInputField} from 'components/NixInputField';
import {NixButton} from 'components/NixButton';
import CountryPicker from 'react-native-country-picker-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

// validation
import step2ValidationSchema from './validation';

// constants
import {Routes} from 'navigation/Routes';

// hooks
import {useDispatch} from 'hooks';

// ssrvices
import baseService from 'api/baseService';

// actions
import {updateUserData} from 'store/auth/auth.actions';

// styles
import {styles} from '../../SignupScreen.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CountryCodes} from './types';
import {NutritionType} from 'api/baseService/types';
import {StackNavigatorParamList} from 'navigation/navigation.types';

type Props = {
  showErrorMessage: (error: string) => void;
  errorTextServer: string;
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Signup>;
};

const StepTwoForm: React.FC<Props> = ({
  showErrorMessage,
  errorTextServer,
  navigation,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

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
      throw err;
    }
  }, []);
  console.log(nutritionTopicsList[0].children[0]);

  const step2Handler = (form: {
    username: string;
    country_code: string;
    nutrition_topics: Array<number>;
    country: string;
  }) => {
    if (isLoading) return;
    setIsLoading(true);
    dispatch(
      updateUserData({
        username: form.username,
        country_code: form.country_code,
        nutrition_topics: form.nutrition_topics,
      }),
    )
      .then(user => {
        setIsLoading(false);
        console.log(user);
        navigation.navigate(Routes.LoggedIn, {
          screen: Routes.Home,
          params: {
            screen: Routes.Dashboard,
            params: {
              justLoggedIn: true,
            },
          },
        });
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
        setIsLoading(false);
        showErrorMessage('server error');
      });
  };

  return (
    <>
      <Text style={styles.title}>Finish Setup</Text>
      <Text style={styles.subtitle}>Finish your account setup</Text>
      <Formik
        initialValues={{
          username: '',
          country_code: '820',
          nutrition_topics: [],
          country: 'US',
        }}
        onSubmit={values => step2Handler(values)}
        validationSchema={step2ValidationSchema}
        validateOnMount>
        {({handleSubmit, isValid, values, setFieldValue}) => (
          <>
            <Field
              component={NixInputField}
              name="username"
              label="Username"
              style={styles.input}
              leftComponent={
                <FontAwesome
                  name={'envelope-o'}
                  size={30}
                  style={{marginRight: 15, marginBottom: 2, color: '#666'}}
                />
              }
              autoCapitalize="none"
            />

            <View style={styles.inputWrapper}>
              <View>
                <CountryPicker
                  countryCode={values.country as CountryCodes}
                  withCallingCode={true}
                  withCountryNameButton={true}
                  withFilter={true}
                  onSelect={country => {
                    setFieldValue('country', country.cca2);
                    setFieldValue('country_code', country.callingCode[0]);
                    console.log('country', country);
                  }}
                />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <SectionedMultiSelect
                items={nutritionTopicsList}
                // @ts-ignore
                IconRenderer={Icon}
                uniqueKey="id"
                subKey="children"
                selectText="Nutrition Topics"
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

            {!isLoading ? (
              <View style={{width: '100%'}}>
                <NixButton
                  title="Sumbit"
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

export default StepTwoForm;
