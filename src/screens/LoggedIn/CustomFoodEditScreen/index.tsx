// utils
import React, {useCallback, useState, useEffect, useLayoutEffect} from 'react';

// hooks
import {useDispatch} from 'hooks/useRedux';

// components
import {View, Text, TouchableOpacity} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NixButton} from 'components/NixButton';
import CustomFoodField from 'components/CustomFoodField';
import {NavigationHeader} from 'components/NavigationHeader';

// actions
import {updateOrCreateCustomFood} from 'store/customFoods/customFoods.actions';

// constants
import {Routes} from 'navigation/Routes';

// helpres
import {RouteProp} from '@react-navigation/native';
import nixApiDataUtilites from 'helpers/nixApiDataUtilites/nixApiDataUtilites';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {UpdateCustomFoodProps} from 'store/customFoods/customFoods.types';

// styles
import {styles} from './CustomFoodEditScreen.styles';

interface CustomFoodEditScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.CustomFoodEdit
  >;
  route: RouteProp<StackNavigatorParamList, Routes.CustomFoodEdit>;
}

export const CustomFoodEditScreen: React.FC<CustomFoodEditScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const [foodObj, setFoodObj] = useState<UpdateCustomFoodProps>({
    food_name: '',
    nf_vitamin_a_dv: null,
    nf_vitamin_c_dv: null,
    nf_vitamin_d_dv: null,
    nf_calcium_dv: null,
    nf_iron_dv: null,
    nf_calories: null,
    nf_cholesterol: null,
    nf_dietary_fiber: null,
    nf_p: null,
    nf_potassium: null,
    nf_protein: null,
    nf_saturated_fat: null,
    nf_sodium: null,
    nf_sugars: null,
    nf_total_carbohydrate: null,
    nf_total_fat: null,
    serving_qty: 1,
    serving_unit: 'Serving',
    source: 9,
    source_key: null,
    full_nutrients: [],
  });

  useEffect(() => {
    setFoodObj(prevFood => {
      if (route.params?.food) {
        return {
          ...prevFood,
          ...route.params?.food,
          ...nixApiDataUtilites.convertFullNutrientsToNfAttributes(
            route.params?.food?.full_nutrients || [],
          ),
        };
      } else {
        return prevFood;
      }
    });
  }, [route.params?.food]);

  const saveCustomFood = useCallback(async () => {
    const clonedFood = {...foodObj};
    clonedFood.full_nutrients =
      nixApiDataUtilites.buildFullNutrientsArray(clonedFood);

    delete clonedFood.source;
    delete clonedFood.source_key;
    delete clonedFood.nf_vitamin_a_dv;
    delete clonedFood.nf_vitamin_c_dv;
    delete clonedFood.nf_vitamin_d_dv;
    delete clonedFood.nf_calcium_dv;
    delete clonedFood.nf_iron_dv;

    dispatch(updateOrCreateCustomFood(clonedFood)).then(result => {
      if (result && result.food_name) {
        navigation.navigate(Routes.CustomFoods);
      }
    });
  }, [foodObj, dispatch, navigation]);

  let updateCustomField = (
    fieldName: keyof UpdateCustomFoodProps,
    newValue: string,
  ) => {
    setFoodObj(prev => {
      const clonedFoodObj = {...prev};
      clonedFoodObj[fieldName] = parseFloat(newValue) as never;
      return clonedFoodObj;
    });
  };

  let updateTextField = (
    fieldName: keyof UpdateCustomFoodProps,
    newValue: string,
  ) => {
    setFoodObj(prev => {
      const clonedFoodObj = {...prev};
      clonedFoodObj[fieldName] = newValue as never;
      return clonedFoodObj;
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <NavigationHeader
          {...props}
          headerTitle={
            route.params?.food ? 'Edit Custom Food' : 'Create Custom Food'
          }
          headerRight={
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() => saveCustomFood()}>
              <Text style={styles.saveBtn}>Save</Text>
              {/* <FontAwesome5 size={26} color={'white'} name="save" /> */}
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [navigation, route, saveCustomFood]);

  const handleCopy = () => {
    console.log(foodObj);
  };

  return (
    <KeyboardAwareScrollView style={styles.root}>
      <ScrollView style={styles.scrollView}>
        <View>
          <Text>Food Name:</Text>
          <TextInput
            style={styles.input}
            value={foodObj.food_name || ''}
            placeholder="Food Name"
            onChangeText={value => updateTextField('food_name', value)}
          />
        </View>

        <View>
          <Text>Serving Info</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={(foodObj.serving_qty || '') + '' || '1'}
              placeholder=""
              onChangeText={value => updateTextField('serving_qty', value)}
            />
            <TextInput
              style={styles.input}
              value={foodObj.serving_unit || 'Serving'}
              placeholder=""
              onChangeText={value => updateTextField('serving_unit', value)}
            />
          </View>
        </View>

        <CustomFoodField
          label="Calories"
          value={foodObj.nf_calories}
          fieldName="nf_calories"
          measureUnit="kcal"
          onFieldChange={updateCustomField}
        />

        <CustomFoodField
          label="Fat"
          value={foodObj.nf_total_fat}
          fieldName="nf_total_fat"
          measureUnit="g"
          onFieldChange={updateCustomField}>
          <CustomFoodField
            label="Saturated Fat"
            value={foodObj.nf_saturated_fat}
            fieldName="nf_saturated_fat"
            measureUnit="g"
            onFieldChange={updateCustomField}
          />
        </CustomFoodField>

        <CustomFoodField
          label="Cholesterol"
          value={foodObj.nf_cholesterol}
          fieldName="nf_cholesterol"
          measureUnit="mg"
          onFieldChange={updateCustomField}
        />

        <CustomFoodField
          label="Sodium"
          value={foodObj.nf_sodium}
          fieldName="nf_sodium"
          measureUnit="mg"
          onFieldChange={updateCustomField}
        />

        <CustomFoodField
          label="Total Carbohydrate"
          value={foodObj.nf_total_carbohydrate}
          fieldName="nf_total_carbohydrate"
          measureUnit="g"
          onFieldChange={updateCustomField}>
          <CustomFoodField
            label="Dietary Fiber"
            value={foodObj.nf_dietary_fiber}
            fieldName="nf_dietary_fiber"
            measureUnit="g"
            onFieldChange={updateCustomField}
          />
          <CustomFoodField
            label="Sugars"
            value={foodObj.nf_sugars}
            fieldName="nf_sugars"
            measureUnit="g"
            onFieldChange={updateCustomField}
          />
        </CustomFoodField>

        <CustomFoodField
          label="Protein"
          value={foodObj.nf_protein}
          fieldName="nf_protein"
          measureUnit="g"
          onFieldChange={updateCustomField}
        />

        <CustomFoodField
          label="Vitamin A"
          value={foodObj.nf_vitamin_a_dv || ''}
          fieldName="nf_vitamin_a_dv"
          measureUnit="%dv"
          onFieldChange={updateCustomField}
        />

        <CustomFoodField
          label="Vitamin C"
          value={foodObj.nf_vitamin_c_dv || ''}
          fieldName="nf_vitamin_c_dv"
          measureUnit="%dv"
          onFieldChange={updateCustomField}
        />

        <CustomFoodField
          label="Vitamin D"
          value={foodObj.nf_vitamin_d_dv || ''}
          fieldName="nf_vitamin_d_dv"
          measureUnit="%dv"
          onFieldChange={updateCustomField}
        />

        <CustomFoodField
          label="Calcium"
          value={foodObj.nf_calcium_dv || ''}
          fieldName="nf_calcium_dv"
          measureUnit="%dv"
          onFieldChange={updateCustomField}
        />

        <CustomFoodField
          label="Iron"
          value={foodObj.nf_iron_dv || ''}
          fieldName="nf_iron_dv"
          measureUnit="%dv"
          onFieldChange={updateCustomField}
        />

        <CustomFoodField
          label="Phosphorus"
          value={foodObj.nf_p}
          fieldName="nf_p"
          measureUnit="mg"
          onFieldChange={updateCustomField}
        />

        <CustomFoodField
          label="Potassium"
          value={foodObj.nf_potassium}
          fieldName="nf_potassium"
          measureUnit="mg"
          onFieldChange={updateCustomField}
        />

        <View style={styles.footer}>
          <View style={[styles.flex1, styles.mr5]}>
            <NixButton title="Copy" type="primary" onPress={handleCopy} />
          </View>
          <View style={[styles.flex1, styles.ml5]}>
            <NixButton title="Log this food" type="calm" />
          </View>
        </View>
      </ScrollView>
      <View>
        <TextInput />
      </View>
    </KeyboardAwareScrollView>
  );
};
