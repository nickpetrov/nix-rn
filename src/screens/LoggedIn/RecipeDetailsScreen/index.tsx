// utils
import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Swipeable,
  TouchableOpacity,
  TextInput as GHTextInput,
} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixButton} from 'components/NixButton';
import InfoModal from 'components/InfoModal';
import {NavigationHeader} from 'components/NavigationHeader';
import ChooseModal from 'components/ChooseModal';
import VoiceInput from 'components/VoiceInput';
import AddPhotoView from 'components/AddPhotoView';
import GoBackModal from 'components/GoBackModal';
import LoadIndicator from 'components/LoadIndicator';

// actions
import {
  copyRecipe,
  createRecipe,
  getIngridientsForUpdate,
  getRecipeById,
  updateRecipe,
} from 'store/recipes/recipes.actions';
import * as basketActions from 'store/basket/basket.actions';
import {setInfoMessage} from 'store/base/base.actions';
import {uploadImage} from 'store/userLog/userLog.actions';

// constants
import {Routes} from 'navigation/Routes';

// types
import {Asset} from 'react-native-image-picker';
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {RouteProp} from '@react-navigation/native';
import {RecipeProps, UpdateRecipeProps} from 'store/recipes/recipes.types';

// helpers
import nixApiDataUtilites from 'helpers/nixApiDataUtilites/nixApiDataUtilites';
import {multiply} from 'helpers/multiply';
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';
import {analyticTrackEvent} from 'helpers/analytics.ts';
import {replaceRegexForNumber} from 'helpers/index';

// styles
import {styles} from './RecipeDetailsScreen.styles';

interface RecipeDetailsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.RecipeDetails
  >;
  route: RouteProp<StackNavigatorParamList, Routes.RecipeDetails>;
}

type ErrorIngridient = {
  text: string;
  index: number;
  error: string;
};

export const RecipeDetailsScreen: React.FC<RecipeDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const emptyBasket = useSelector(state => state.basket.foods.length === 0);
  const inputRefs = useRef<{[key: string]: TextInput | null}>({});
  const ingridientsInputRefs = useRef<Array<TextInput | null>>([]);
  const [error, setError] = useState<false | string>(false);
  const [errorIngridient, setErrorIngridient] = useState<
    ErrorIngridient | false
  >(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showSave, setShowSave] = useState<boolean>(false);
  const recipes = useSelector(state => state.recipes.recipes);
  const [copyRecipePopup, setCopyRecipePopup] = useState(false);
  const [newRecipeName, setNewRecipeName] = useState<string>('');
  const [defaultRecipe, setDefaultRecipe] = useState<UpdateRecipeProps>({
    name: '',
    serving_qty: 1,
    serving_unit: 'Serving',
    prep_time_min: null,
    cook_time_min: null,
    ingredients: [],
    directions: '',
  });
  const [showUnsavedPopup, setShowUnsavedPopup] = useState<null | {
    backAction: Readonly<{
      type: string;
      payload?: object | undefined;
      source?: string | undefined;
      target?: string | undefined;
    }>;
  }>(null);
  const [recipe, setRecipe] = useState<UpdateRecipeProps>({
    name: '',
    serving_qty: 1,
    serving_unit: 'Serving',
    prep_time_min: null,
    cook_time_min: null,
    ingredients: [],
    directions: '',
  });
  let rowRefs = new Map<string, Swipeable>();
  const [caloriesPerServing, setCaloriesPerServing] = useState(0);
  const [showNewIngredientsInput, setShowNewIngredientInput] = useState(false);
  const [loadingCopyRecipe, setLoadingCopyRecipe] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [addIngredientsQuery, setAddIngredientsQuery] = useState('');
  const defaultErrorMessages = {
    name: '',
    serving_unit: '',
    serving_qty: '',
    ingredients: '',
  };
  const [errorMessages, setErrorMessages] = useState(defaultErrorMessages);

  const addIngredientPlaceholder = `For best results, please limit one ingredient per line.

  E.g.
  2 cups baby spinach
  1 tbsp olive oil
  .25 cups onions, chopped`;

  useEffect(() => {
    if (route.params?.recipe) {
      setShowPreloader(true);
      dispatch(getRecipeById(route.params?.recipe.id))
        .then((resp: RecipeProps) => {
          _.forEach(resp.ingredients, function (foodObj) {
            if (foodObj.alt_measures) {
              const temp = {
                serving_weight: foodObj.serving_weight_grams,
                seq: null,
                measure: foodObj.serving_unit,
                qty: foodObj.serving_qty,
              };
              foodObj.alt_measures.unshift(temp);
            }
            if (!foodObj.metadata || !foodObj.metadata.original_input) {
              if (!foodObj.metadata) {
                foodObj.metadata = {};
              }
              foodObj.metadata.original_input =
                foodObj.serving_qty +
                ' ' +
                foodObj.serving_unit +
                ' ' +
                foodObj.food_name;
            }
          });
          setRecipe(resp);
          setDefaultRecipe(resp);
          setShowPreloader(false);
        })
        .catch(err => {
          console.log(err);
          setShowPreloader(false);
        });
    }
  }, [route.params?.recipe, dispatch]);

  const validatedRecipe = useCallback(() => {
    if (!recipe.name) {
      setErrorMessages(prev => ({
        ...prev,
        name: 'Recipe Name is required',
      }));
      setInvalidForm(true);
      return false;
    }

    if (!recipe.serving_unit) {
      setErrorMessages(prev => ({
        ...prev,
        serving_unit: 'Serving unit is required',
      }));
      setInvalidForm(true);
      return false;
    }

    if (!recipe.serving_qty) {
      setErrorMessages(prev => ({
        ...prev,
        serving_qty: 'Serving quantity is required',
      }));
      setInvalidForm(true);
      return false;
    }

    if (!recipe.ingredients.length) {
      setErrorMessages(prev => ({
        ...prev,
        ingredients: 'Recipe must have at least one ingredient',
      }));
      setInvalidForm(true);
      return false;
    }
    return true;
  }, [recipe]);

  const saveRecipe = useCallback(
    async (logAfterUpdate?: boolean) => {
      if (!validatedRecipe()) {
        return;
      }
      setShowSpinner(true);
      if (route.params?.recipe) {
        const recipeToUpdate = _.cloneDeep(recipe);
        delete recipeToUpdate.public_id;
        delete recipeToUpdate.created_at;
        delete recipeToUpdate.updated_at;
        delete recipeToUpdate.full_nutrients;
        delete recipeToUpdate.serving_weight_grams;
        if (!recipeToUpdate.directions?.length) {
          delete recipeToUpdate.directions;
        }
        return await dispatch(updateRecipe(recipeToUpdate))
          .then(res => {
            setShowSave(false);
            setShowSpinner(false);
            return res;
          })
          .then(res => {
            if (logAfterUpdate) {
              return res;
            } else {
              navigation.navigate(Routes.Recipes, {
                showSavedRecipeMessage: true,
              });
            }
          })
          .catch(err => {
            setShowSpinner(false);
            if (!!err && !!err.data && !!err.data.message) {
              setError(err.data.message);
            }
          });
      } else {
        const recipeToUpdate = _.cloneDeep(recipe);
        if (!recipeToUpdate.directions?.length) {
          delete recipeToUpdate.directions;
        }
        return await dispatch(createRecipe(recipeToUpdate))
          .then(res => {
            setShowSave(false);
            setShowSpinner(false);
            return res;
          })
          .then(res => {
            analyticTrackEvent(
              'Recipe_created',
              'Created from the recipes interface',
            );
            if (logAfterUpdate) {
              return res;
            } else {
              navigation.navigate(Routes.Recipes, {
                showSavedRecipeMessage: true,
              });
            }
          })
          .catch(err => {
            setShowSpinner(false);
            if (
              !!err &&
              !!err.data &&
              !!err.data.message &&
              err.data.message === 'resource already exists'
            ) {
              setError(err.data.message);
            }
          });
      }
    },
    [recipe, dispatch, navigation, route.params?.recipe, validatedRecipe],
  );

  useEffect(() => {
    if (recipe && !showPreloader) {
      setShowSave(!_.isEqual(recipe, defaultRecipe));
    }
  }, [recipe, defaultRecipe, showPreloader]);

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
    getIngridientsForUpdate({
      query: addIngredientsQuery,
      line_delimited: true,
      use_raw_foods: true,
    })
      .then(result => {
        if (!!result.foods && result.foods.length) {
          _.forEach(result.foods, function (foodObj) {
            if (foodObj.alt_measures) {
              const temp = {
                serving_weight: foodObj.serving_weight_grams,
                seq: null,
                measure: foodObj.serving_unit,
                qty: foodObj.serving_qty,
              };
              foodObj.alt_measures.unshift(temp);
            }
            if (!foodObj.metadata.original_input) {
              foodObj.metadata.original_input =
                foodObj.serving_qty +
                ' ' +
                foodObj.serving_unit +
                ' ' +
                foodObj.food_name;
            }
          });
          setRecipe({
            ...recipe,
            ingredients: recipe.ingredients.concat(result.foods),
          });
          setAddIngredientsQuery('');
        }
        setShowNewIngredientInput(false);
      })
      .catch(() => {
        getIngridientsForUpdate({
          query: addIngredientsQuery,
          line_delimited: false,
          use_raw_foods: true,
        })
          .then(result => {
            if (!!result.foods && result.foods.length) {
              _.forEach(result.foods, function (foodObj) {
                if (foodObj.alt_measures) {
                  const temp = {
                    serving_weight: foodObj.serving_weight_grams,
                    seq: null,
                    measure: foodObj.serving_unit,
                    qty: foodObj.serving_qty,
                  };
                  foodObj.alt_measures.unshift(temp);
                }
                if (!foodObj.metadata.original_input) {
                  foodObj.metadata.original_input =
                    foodObj.serving_qty +
                    ' ' +
                    foodObj.serving_unit +
                    ' ' +
                    foodObj.food_name;
                }
              });
              setRecipe({
                ...recipe,
                ingredients: recipe.ingredients.concat(result.foods),
              });
              setAddIngredientsQuery('');
            }
          })
          .catch(res => {
            setAddIngredientsQuery('');
            setError(res?.data?.message);
            setInvalidForm(true);

            if (!!res.errors && res.errors.length) {
              const wrongQuery = res.errors.map((err: any) => {
                return err.original_text;
              });
              console.log(wrongQuery.join('\n'));
              setAddIngredientsQuery(wrongQuery.join('\n'));
              setInvalidForm(true);
            }
          });
        setShowNewIngredientInput(false);
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
    if (fieldName === 'name' && newValue) {
      setErrorMessages(prev => ({
        ...prev,
        name: '',
      }));
    }
  };

  let updateNumberField = (
    fieldName: keyof UpdateRecipeProps,
    newValue: string,
  ) => {
    const val = replaceRegexForNumber(newValue);

    setRecipe(prevRecipe => {
      const clonedRecipe = {...prevRecipe};
      clonedRecipe[fieldName] = parseFloat(val) as never;
      return {...clonedRecipe};
    });
    if (fieldName === 'serving_qty' && parseFloat(val)) {
      setErrorMessages(prev => ({
        ...prev,
        serving_qty: '',
      }));
    }
  };

  useEffect(() => {
    if (invalidForm) {
      setTimeout(() => {
        setInvalidForm(false);
      }, 500);
    }
  }, [invalidForm]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!showSave) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Prompt the user before leaving the screen
        setShowUnsavedPopup({
          backAction: e.data.action,
        });
      }),
    [navigation, showSave],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader
          {...props}
          navigation={navigation}
          headerTitle={
            route.params?.recipe ? 'Edit Recipe' : 'Create New Recipe'
          }
          headerRight={
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() => {
                if (route.params?.recipe) {
                  navigation.goBack();
                } else {
                  saveRecipe();
                }
              }}>
              <Text style={styles.headerBtn}>
                {route.params?.recipe ? 'Cancel' : 'Save'}
              </Text>
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [navigation, route, saveRecipe]);

  const saveChangeIngredient = (text: string, index: number) => {
    if (text === recipe.ingredients[index]?.metadata?.original_input) {
      return;
    }
    getIngridientsForUpdate({
      query: text,
      line_delimited: true,
      use_raw_foods: true,
    })
      .then(result => {
        if (!!result.foods && result.foods.length) {
          const newIngridients = [...recipe.ingredients];
          newIngridients[index] = result.foods[0];
          if (!newIngridients[index]?.metadata?.original_input) {
            newIngridients[index] = {
              ...newIngridients[index],
              metadata: {
                ...newIngridients[index]?.metadata,
                original_input: text,
              },
            };
          }
          setRecipe(() => {
            return {
              ...recipe,
              ingredients: newIngridients,
            };
          });
        }
      })
      .catch(err => {
        setErrorIngridient({
          error:
            err?.data?.message ===
            'child "query" fails because ["query" is not allowed to be empty]'
              ? 'No food found.'
              : err?.data?.message + ' for:',
          text,
          index,
        });
        setInvalidForm(true);
      });
  };
  const handleDeleteUploadPhoto = useCallback(() => {
    setRecipe(prev => {
      return {
        ...prev,
        photo: defaultRecipe?.photo,
      };
    });
  }, [defaultRecipe?.photo]);

  const handleChangePhoto = useCallback((photo: Asset) => {
    if (photo) {
      setPhotoUploading(true);
      uploadImage('foods', moment().format('YYYY-MM-DD'), photo)
        .then(result => {
          if (result) {
            console.log(result);
            setRecipe(prev => {
              return {
                ...prev,
                photo: {
                  highres: result.full,
                  thumb: result.thumb,
                  is_user_uploaded: true,
                },
              };
            });
          }
          setPhotoUploading(false);
        })
        .catch(() => {
          setPhotoUploading(false);
        });
    }
  }, []);

  const removeIngridient = (index: number) => {
    setRecipe(prev => {
      const newIngridients = [...prev.ingredients];
      newIngridients.splice(index, 1);
      return {
        ...prev,
        ingredients: newIngridients,
      };
    });
  };

  const startCopyRecipe = () => {
    setCopyRecipePopup(true);
    setNewRecipeName(recipe.name);
  };

  const handleCopyRecipe = () => {
    const match = recipes.some(
      (item: RecipeProps) => item.name === newRecipeName,
    );
    if (!newRecipeName || match || newRecipeName === recipe.name) {
      dispatch(
        setInfoMessage({
          title: 'Error',
          text: 'Recipe name must be unique',
        }),
      );
    } else {
      setLoadingCopyRecipe(true);
      const clonedRecipeIndex = recipes.findIndex(
        item => item.id === recipe.id,
      );
      const clonedRecipe: UpdateRecipeProps = _.cloneDeep(recipe);
      delete clonedRecipe.created_at;
      delete clonedRecipe.updated_at;
      delete clonedRecipe.id;
      clonedRecipe.name = newRecipeName;
      dispatch(copyRecipe(clonedRecipe, clonedRecipeIndex))
        .then(resCopyRecipe => {
          setCopyRecipePopup(false);
          setNewRecipeName('');
          setLoadingCopyRecipe(false);
          if (resCopyRecipe) {
            navigation.navigate(Routes.RecipeDetails, {
              recipe: resCopyRecipe,
            });
          }
          analyticTrackEvent(
            'Recipe_copied',
            'Copied from the edit recipe interface',
          );
        })
        .catch(err => {
          setLoadingCopyRecipe(false);
          if (!!err && !!err.data && !!err.data.message) {
            setError(err.data.message);
          }
        });
    }
  };

  const logRecipe = async () => {
    if (!validatedRecipe()) {
      return;
    }
    const savedRecipe = await saveRecipe(true);

    if (savedRecipe) {
      const recipeToLog = _.cloneDeep(savedRecipe);

      // need to do this for top level as well as each ingredient
      const nf = nixApiDataUtilites.convertFullNutrientsToNfAttributes(
        recipeToLog.full_nutrients,
      );
      const accepted = [
        'nf_calories',
        'nf_total_fat',
        'nf_saturated_fat',
        'nf_cholesterol',
        'nf_sodium',
        'nf_total_carbohydrate',
        'nf_dietary_fiber',
        'nf_sugars',
        'nf_protein',
        'nf_potassium',
        'nf_p',
      ];
      const keep = _.pick(nf, accepted);
      _.extend(recipeToLog, keep);

      _.forEach(recipeToLog.ingredients, function (ingredient) {
        const ing_nf = nixApiDataUtilites.convertFullNutrientsToNfAttributes(
          ingredient.full_nutrients,
        );
        const ing_keep = _.pick(ing_nf, accepted);
        _.extend(ingredient, ing_keep);
      });

      //only want to log 1 serving
      const scaled_recipe = multiply(
        recipeToLog,
        1 / savedRecipe.serving_qty,
        1,
      );

      dispatch(
        basketActions.addExistFoodToBasket(scaled_recipe.ingredients),
      ).then(() => {
        analyticTrackEvent('Added_recipe_to_the_basket', ' ');
        dispatch(
          basketActions.mergeBasket({
            isSingleFood: true,
            recipeBrand: scaled_recipe.brand_name,
            servings: scaled_recipe.serving_qty.toString(),
            recipeName: scaled_recipe.name,
            customPhoto:
              !!savedRecipe.photo && !!savedRecipe.photo.highres
                ? {
                    full: savedRecipe.photo.highres,
                    thumb: savedRecipe.photo.thumb,
                    is_user_uploaded: false,
                  }
                : null,
            meal_type: emptyBasket
              ? guessMealTypeByTime(moment().hours())
              : undefined,
          }),
        );
        navigation.replace(Routes.Basket);
      });
    }
  };

  return (
    <>
      {showPreloader && (
        <View style={styles.preloader}>
          <Text style={styles.preloaderText}>Loading. Please wait.</Text>
        </View>
      )}
      <KeyboardAwareScrollView
        style={styles.root}
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        enableAutomaticScroll={true}>
        {invalidForm && <Text style={styles.invalid}>Recipe not saved</Text>}
        <View style={styles.itemWrap}>
          <TextInput
            selectTextOnFocus
            value={recipe.name}
            onChangeText={text => updateTextField('name', text)}
            style={[styles.input, !!errorMessages.name && styles.invalidInput]}
            placeholder="Recipe Name"
            returnKeyType="next"
            ref={ref => (inputRefs.current.name = ref)}
            onSubmitEditing={() => {
              const nextRef = inputRefs.current.serving_qty;
              if (nextRef) {
                nextRef?.focus();
              }
            }}
            blurOnSubmit={false}
          />
          {errorMessages.name && (
            <Text style={styles.errorMessage}>{errorMessages.name}</Text>
          )}
        </View>
        <View style={[styles.itemWrap, styles.recipeContainer]}>
          <View style={styles.label}>
            <Text>
              Recipe Makes<Text style={styles.red}>*</Text>
            </Text>
            {errorMessages.serving_qty && (
              <Text style={styles.errorMessage}>
                {errorMessages.serving_qty}
              </Text>
            )}
          </View>
          <View style={styles.inputs}>
            <View style={styles.flex1}>
              <TextInput
                selectTextOnFocus
                value={(recipe.serving_qty || '') + ''}
                onChangeText={text => updateNumberField('serving_qty', text)}
                style={[
                  styles.input,
                  styles.textAlCenter,
                  !!errorMessages.serving_qty && styles.invalidInput,
                ]}
                keyboardType="numeric"
                returnKeyType="next"
                ref={ref => (inputRefs.current.serving_qty = ref)}
                onSubmitEditing={() => {
                  const nextRef = inputRefs.current.prep_time_min;
                  if (nextRef) {
                    nextRef?.focus();
                  }
                }}
                blurOnSubmit={false}
              />
            </View>
            <View style={[styles.flex1, styles.ml8]}>
              <Text style={styles.textAlCenter}>
                {recipe.serving_unit}
                {recipe.serving_qty > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.itemWrap, styles.recipeContainer]}>
          <View style={styles.totalContainer}>
            <FontAwesome5 name="clock" size={20} />
            <Text style={[styles.mh8]}>
              Total: {(recipe.prep_time_min || 0) + (recipe.cook_time_min || 0)}{' '}
              min
            </Text>
          </View>
          <View style={styles.inputs}>
            <View style={[styles.flex1]}>
              <TextInput
                selectTextOnFocus
                value={(recipe.prep_time_min || '') + ''}
                onChangeText={text =>
                  updateNumberField(
                    'prep_time_min',
                    text.replace(/[^0-9]/g, ''),
                  )
                }
                placeholder="0 min"
                keyboardType="numeric"
                style={[styles.numericInput, styles.textAlCenter]}
                returnKeyType="next"
                ref={ref => (inputRefs.current.prep_time_min = ref)}
                onSubmitEditing={() => {
                  const nextRef = inputRefs.current.cook_time_min;
                  if (nextRef) {
                    nextRef?.focus();
                  }
                }}
                blurOnSubmit={false}
              />
              <View style={styles.prepContainer}>
                <Text style={styles.fz11}>Preparation</Text>
              </View>
            </View>
            <View style={[styles.flex1, styles.ml8]}>
              <TextInput
                selectTextOnFocus
                value={(recipe.cook_time_min || '') + ''}
                onChangeText={text =>
                  updateNumberField(
                    'cook_time_min',
                    text.replace(/[^0-9]/g, ''),
                  )
                }
                placeholder="0 min"
                keyboardType="numeric"
                style={[styles.numericInput, styles.textAlCenter]}
                ref={ref => (inputRefs.current.cook_time_min = ref)}
              />
              <View style={styles.prepContainer}>
                <Text style={styles.fz11}>Cooking</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.ingridientsContainer}>
          <Text>Ingredients:</Text>
          <Text>Calories Per Serving: {caloriesPerServing}</Text>
        </View>
        <View>
          {recipe.ingredients.map((ingredient, index) => {
            return (
              <View
                style={styles.ingridientItemContainer}
                key={
                  `${ingredient.metadata?.original_input} - ${index}` || index
                }>
                <Swipeable
                  renderRightActions={() => (
                    <TouchableOpacity
                      onPress={() => removeIngridient(index)}
                      style={[styles.btnHidden]}>
                      <FontAwesome name="trash" color="#fff" size={16} />
                    </TouchableOpacity>
                  )}
                  ref={ref => {
                    if (
                      ref &&
                      !rowRefs.get(ingredient.id + ingredient.food_name)
                    ) {
                      rowRefs.set(ingredient.id + ingredient.food_name, ref);
                    }
                  }}
                  onSwipeableWillOpen={() => {
                    [...rowRefs.entries()].forEach(([key, ref]) => {
                      if (key !== ingredient.id + ingredient.food_name && ref) {
                        ref.close();
                      }
                    });
                  }}>
                  <View style={styles.ingridientItem}>
                    <Image
                      style={styles.ingridientItemImage}
                      source={
                        ingredient.photo.thumb
                          ? {uri: ingredient.photo.thumb}
                          : require('assets/gray_nix_apple_small.png')
                      }
                      resizeMode="contain"
                    />
                    <GHTextInput
                      ref={el =>
                        (ingridientsInputRefs.current[index] =
                          el as GHTextInput)
                      }
                      defaultValue={ingredient.metadata?.original_input || ''}
                      // value={ingredient.metadata?.original_input || ''}
                      onEndEditing={({nativeEvent: {text}}) => {
                        saveChangeIngredient(text, index);
                      }}
                      style={[styles.input, styles.flex1]}
                    />
                    <View style={styles.ingridientItemFooter}>
                      <Text>{ingredient.nf_calories?.toFixed(0)}</Text>
                      <Text>kcal</Text>
                    </View>
                  </View>
                </Swipeable>
              </View>
            );
          })}
          <TouchableWithoutFeedback
            style={styles.flex1}
            onPress={() => handleShowAddIngredientsInput()}>
            <View style={styles.ingrBtnContainer}>
              <FontAwesome5 name="plus" size={15} style={styles.ingrBtnIcon} />
              <Text style={styles.ingrBtnText}>Add Ingredients</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View>
          <Text style={styles.directionText}>Directions</Text>
          <TextInput
            value={recipe.directions || ''}
            onChangeText={text => updateTextField('directions', text)}
            multiline={true}
            numberOfLines={4}
            style={styles.directionInput}
            placeholder="Type your recipe prep notes and cooking instructions here."
          />
        </View>
        {errorMessages.ingredients && (
          <View style={styles.itemWrap}>
            <Text style={styles.red}>{errorMessages.ingredients}</Text>
          </View>
        )}
        <AddPhotoView
          image={recipe.photo}
          deletePhoto={handleDeleteUploadPhoto}
          changePhoto={handleChangePhoto}
          isUploadPhotoLoading={photoUploading}
        />
        {route.params?.recipe && (
          <View style={styles.footer}>
            <View style={{flex: 1, marginRight: 5}}>
              <NixButton
                title="Copy"
                type="primary"
                onPress={startCopyRecipe}
              />
            </View>
            <View style={{flex: 1, marginLeft: 5}}>
              <NixButton
                title="Log this recipe"
                type="calm"
                onPress={logRecipe}
              />
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
      {error && (
        <InfoModal
          modalVisible={!!error}
          setModalVisible={() => setError(false)}
          text={error}
        />
      )}
      <ChooseModal
        modalVisible={!!showNewIngredientsInput}
        hideModal={() => setShowNewIngredientInput(false)}
        title="Add Ingredients"
        btns={[
          {
            type: 'primary',
            title: 'Add',
            onPress: () => {
              handleAddIngredients();
            },
          },
          {
            type: 'gray',
            title: 'Cancel',
            onPress: () => {
              setAddIngredientsQuery('');
              setShowNewIngredientInput(false);
            },
          },
        ]}>
        <View style={styles.voiceInputContainer}>
          <VoiceInput
            style={styles.voiceInput}
            placeholder={addIngredientPlaceholder}
            value={addIngredientsQuery}
            onChangeText={(value: string) => setAddIngredientsQuery(value)}
          />
        </View>
      </ChooseModal>
      {showSave && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          contentContainerStyle={{flex: 1}}
          style={styles.saveBtnContainer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => saveRecipe()}
            disabled={showSpinner || photoUploading}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
      {!!showUnsavedPopup?.backAction && (
        <GoBackModal
          show={!!showUnsavedPopup}
          goBack={() => {
            navigation.dispatch(showUnsavedPopup?.backAction);
          }}
          disabled={showSpinner}
          save={() => {
            setShowUnsavedPopup(null);
            saveRecipe();
          }}
        />
      )}
      <ChooseModal
        modalVisible={!!copyRecipePopup}
        hideModal={() => {
          setCopyRecipePopup(false);
          setNewRecipeName('');
        }}
        title="Copy Recipe"
        text="Enter new unique name for the new recipe"
        btns={[
          {
            type: 'gray',
            title: 'Cancel',
            onPress: () => {
              setCopyRecipePopup(false);
              setNewRecipeName('');
            },
          },
          {
            type: 'primary',
            title: 'Sumbit',
            onPress: () => {
              handleCopyRecipe();
            },
            disabled: loadingCopyRecipe,
          },
        ]}>
        <TextInput
          value={newRecipeName}
          onChangeText={setNewRecipeName}
          editable={!loadingCopyRecipe}
        />
      </ChooseModal>
      <ChooseModal
        modalVisible={!!errorIngridient}
        hideModal={() => {
          setErrorIngridient(false);
        }}
        title={(errorIngridient && errorIngridient.error) || ''}
        text={(errorIngridient && errorIngridient.text) || ''}
        btns={[
          {
            type: 'primary',
            title: 'Edit',
            onPress: () => {
              setErrorIngridient(false);
              if (
                errorIngridient &&
                ingridientsInputRefs.current[errorIngridient.index]
              ) {
                ingridientsInputRefs.current[errorIngridient.index]?.focus();
              }
            },
          },
          {
            type: 'gray',
            title: 'Dismiss',
            onPress: () => {
              if (
                errorIngridient &&
                ingridientsInputRefs.current[errorIngridient.index]
              ) {
                ingridientsInputRefs.current[
                  errorIngridient.index
                ]?.setNativeProps({
                  text: recipe.ingredients[errorIngridient.index].metadata
                    ?.original_input,
                });
              }
              setErrorIngridient(false);
            },
          },
        ]}
      />
      {showSpinner && <LoadIndicator withShadow />}
    </>
  );
};
