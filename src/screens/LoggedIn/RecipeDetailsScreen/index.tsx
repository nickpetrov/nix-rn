// utils
import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';

// hooks
import {useDispatch} from 'hooks/useRedux';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FoodItem from 'components/FoodItem';
import {NixButton} from 'components/NixButton';
import ErrorModal from 'components/ErrorModal';

// actions
import {
  getIngridientsForUpdate,
  updateOrCreateRecipe,
} from 'store/recipes/recipes.actions';

// constants
import {Routes} from 'navigation/Routes';

// helpres
import nixHelpers from 'helpers/nixApiDataUtilites/nixApiDataUtilites';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {RouteProp} from '@react-navigation/native';
import {UpdateRecipeProps} from 'store/recipes/recipes.types';
import {FoodProps} from 'store/userLog/userLog.types';

interface RecipeDetailsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.RecipeDetails
  >;
  route: RouteProp<StackNavigatorParamList, Routes.RecipeDetails>;
}

export const RecipeDetailsScreen: React.FC<RecipeDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const [error, setError] = useState<false | string>(false);

  const [recipe, setRecipe] = useState<UpdateRecipeProps>({
    name: '',
    serving_qty: 1,
    serving_unit: 'Serving',
    prep_time_min: null,
    cook_time_min: null,
    ingredients: [],
    directions: '',
  });

  const [caloriesPerServing, setCaloriesPerServing] = useState(0);
  const [showNewIngredientsInput, setShowNewIngredientInput] = useState(false);
  const [addIngredientsQuery, setAddIngredientsQuery] = useState('');

  const addIngredientPlaceholder = `For best results, please limit one ingredient per line.

  E.g.
  2 cups baby spinach
  1 tbsp olive oil
  .25 cups onions, chopped`;

  useEffect(() => {
    setRecipe((prevRecipe: UpdateRecipeProps) => {
      if (route.params?.recipe) {
        const adjustedIngredients =
          route.params?.recipe?.ingredients?.map(foodObj => {
            const adjustedIngredient = {
              ...foodObj,
              ...nixHelpers.convertFullNutrientsToNfAttributes(
                foodObj.full_nutrients,
              ),
            };
            return nixHelpers.convertV1ItemToTrackFood(adjustedIngredient);
          }) || [];
        return {
          ...prevRecipe,
          ...route.params?.recipe,
          ingredients: [...adjustedIngredients],
        };
      } else {
        return prevRecipe;
      }
    });
  }, [route.params?.recipe]);

  const saveRecipe = useCallback(() => {
    dispatch(updateOrCreateRecipe(recipe))
      .then(() => {
        navigation.navigate(Routes.Recipes);
      })
      .catch(err => {
        setError(err.message);
      });
  }, [recipe, dispatch, navigation]);

  const handleItemChange = useCallback((foodObj: FoodProps, index: number) => {
    setRecipe(prevRecipe => {
      const updatedIngredients = [...prevRecipe.ingredients];
      updatedIngredients[index] = foodObj;
      return {...prevRecipe, ingredients: updatedIngredients};
    });
  }, []);

  useEffect(() => {
    let totalCalories = 0;
    recipe.ingredients.map(ingredient => {
      if (ingredient.nf_calories) {
        totalCalories += ingredient.nf_calories;
      } else {
        recipe.ingredients.forEach(item => {
          totalCalories += item.full_nutrients.filter(
            el => el.attr_id === 208,
          )[0].value;
        });
      }
    });
    setCaloriesPerServing(
      Math.round(totalCalories / (recipe.serving_qty || 1)),
    );
  }, [recipe.ingredients, recipe.serving_qty]);

  const handleShowAddIngredientsInput = () => {
    setShowNewIngredientInput(true);
  };

  const handleAddIngredients = async () => {
    getIngridientsForUpdate(addIngredientsQuery).then(result => {
      if (!!result.foods && result.foods.length) {
        setRecipe({
          ...recipe,
          ingredients: recipe.ingredients.concat(result.foods),
        });
        setAddIngredientsQuery('');
      } else {
        setError(result.message);
      }
      if (!!result.errors && result.errors.length) {
        const wrongQuery = result.errors.map((err: any) => {
          return err.original_text;
        });
        console.log(wrongQuery.join('\n'));
        setAddIngredientsQuery(wrongQuery.join('\n'));
      }
    });
  };

  let updateTextField = (
    fieldName: keyof UpdateRecipeProps,
    newValue: string,
  ) => {
    setRecipe(prevRecipe => {
      const clonedRecipe = {...prevRecipe};
      clonedRecipe[fieldName] = newValue as never;
      return {...clonedRecipe};
    });
  };

  let updateNumberField = (
    fieldName: keyof UpdateRecipeProps,
    newValue: string,
  ) => {
    setRecipe(prevRecipe => {
      const clonedRecipe = {...prevRecipe};
      clonedRecipe[fieldName] = parseFloat(newValue) as never;
      return {...clonedRecipe};
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params?.recipe ? 'Edit Recipe' : 'Create New Recipe',
      headerRight: () => (
        <TouchableOpacity onPress={() => saveRecipe()}>
          <Text style={{fontSize: 18, fontWeight: '600', color: '#fff'}}>
            Save
          </Text>
          {/* <FontAwesome5 size={26} color={'white'} name="save" /> */}
        </TouchableOpacity>
      ),
    });
  }, [navigation, route, saveRecipe]);

  return (
    <KeyboardAwareScrollView style={{flex: 1}}>
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={{margin: 10, marginBottom: 0}}>Recipe Name:</Text>
        <TextInput
          value={recipe.name}
          onChangeText={text => updateTextField('name', text)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            margin: 10,
            borderWidth: 1,
            borderColor: '#bebebe',
          }}
        />

        <View style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
          <Text>Recipe Makes:</Text>
          <TextInput
            value={(recipe.serving_qty || '') + ''}
            onChangeText={text => updateNumberField('serving_qty', text)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#bebebe',
              width: 60,
              marginHorizontal: 8,
            }}
            keyboardType="numeric"
          />
          <TextInput
            value={recipe.serving_unit}
            onChangeText={text => updateTextField('serving_unit', text)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#bebebe',
              flex: 1,
              marginLeft: 8,
            }}
          />
        </View>

        <View style={{flexDirection: 'row', margin: 10}}>
          <View style={{flex: 1, alignItems: 'stretch'}}>
            <TextInput
              value={(recipe.prep_time_min || '') + ''}
              onChangeText={text => updateNumberField('prep_time_min', text)}
              placeholder="0 min"
              keyboardType="numeric"
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                textAlign: 'center',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                backgroundColor: '#eee',
              }}
            />
            <View
              style={{
                backgroundColor: '#ccc',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                padding: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 11}}>Preparation</Text>
            </View>
          </View>
          <View style={{flex: 1, alignItems: 'stretch', marginLeft: 8}}>
            <TextInput
              value={(recipe.cook_time_min || '') + ''}
              onChangeText={text => updateNumberField('cook_time_min', text)}
              placeholder="0 min"
              keyboardType="numeric"
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                textAlign: 'center',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                backgroundColor: '#eee',
              }}
            />
            <View
              style={{
                backgroundColor: '#ccc',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                padding: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 11}}>Cooking</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            margin: 10,
          }}>
          <FontAwesome5 name="clock" size={20} />
          <Text style={{fontSize: 18, marginHorizontal: 8}}>
            Total: {(recipe.prep_time_min || 0) + (recipe.cook_time_min || 0)}{' '}
            min
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 8,
            backgroundColor: '#ddd',
          }}>
          <Text>Ingredients:</Text>
          <Text>Calories Per Serving: {caloriesPerServing}</Text>
        </View>
        <View>
          {recipe.ingredients.map((ingredient, index) => {
            return (
              <FoodItem
                key={ingredient.food_name + ingredient.consumed_at}
                foodObj={ingredient}
                itemIndex={index}
                itemChangeCallback={handleItemChange}
              />
            );
          })}
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={() => handleShowAddIngredientsInput()}>
            {!showNewIngredientsInput ? (
              <View
                style={{
                  marginBottom: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: '#fff',
                  borderBottomWidth: 1,
                  borderBottomColor: '#bebebe',
                }}>
                <FontAwesome5 name="plus-circle" size={20} />
                <Text style={{marginLeft: 10}}>Add Ingredients</Text>
              </View>
            ) : (
              <View style={{margin: 10}}>
                <Text style={{marginBottom: 10}}>
                  Type Ingredients in the field below and hit 'Add' button
                </Text>
                <TextInput
                  value={addIngredientsQuery}
                  style={{
                    height: 130,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: '#bebebe',
                  }}
                  multiline={true}
                  placeholder={addIngredientPlaceholder}
                  onChangeText={text => setAddIngredientsQuery(text)}
                />
                <View
                  style={{
                    width: '50%',
                    marginHorizontal: '25%',
                    marginBottom: 10,
                  }}>
                  <NixButton
                    title="Add"
                    type="positive"
                    onPress={() => handleAddIngredients()}
                  />
                </View>
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>

        <View>
          <Text
            style={{
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: '#ddd',
            }}>
            Directions
          </Text>
          <View style={{margin: 10}}>
            <TextInput
              value={recipe.directions || ''}
              onChangeText={text => updateTextField('directions', text)}
              multiline={true}
              style={{
                borderWidth: 1,
                borderColor: '#bebebe',
                minHeight: 100,
              }}
            />
          </View>
        </View>

        <View style={{flexDirection: 'row', marginHorizontal: 10}}>
          <View style={{flex: 1, marginRight: 5}}>
            <NixButton title="Copy" type="primary" />
          </View>
          <View style={{flex: 1, marginLeft: 5}}>
            <NixButton title="Log this recipe" type="calm" />
          </View>
        </View>
      </ScrollView>
      <View>
        <TextInput />
      </View>
      {error && (
        <ErrorModal
          modalVisible={!!error}
          setModalVisible={setError}
          text={error}
        />
      )}
    </KeyboardAwareScrollView>
  );
};
