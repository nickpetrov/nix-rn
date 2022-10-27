// utils
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {FullOptions, Searcher} from 'fast-fuzzy';
import _ from 'lodash';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// components
import {View, Text} from 'react-native';
import {
  FlatList,
  Swipeable,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {NavigationHeader} from 'components/NavigationHeader';
import MealListItem from 'components/FoodLog/MealListItem';
import SwipeHiddenButtons from 'components/SwipeHiddenButtons';
import ChooseModal from 'components/ChooseModal';

// actions
import {
  getRecipes,
  reset,
  deleteRecipe,
  copyRecipe,
} from 'store/recipes/recipes.actions';
import * as basketActions from 'store/basket/basket.actions';
import {setInfoMessage} from 'store/base/base.actions';

// styles
import {styles} from './RecipesScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {RecipeProps, UpdateRecipeProps} from 'store/recipes/recipes.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {RouteProp} from '@react-navigation/native';

interface RecipesScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Recipes
  >;
  route: RouteProp<StackNavigatorParamList, Routes.Recipes>;
}

export const RecipesScreen: React.FC<RecipesScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const [showSavedRecipeMessage, setShowSavedRecipeMessage] = useState(
    route?.params?.showSavedRecipeMessage,
  );
  const {recipes, limit, offset, showMore} = useSelector(
    state => state.recipes,
  );
  let rowRefs = new Map<string, Swipeable>();
  const [loading, setLoading] = useState(false);
  const [loadingCopyRecipe, setLoadingCopyRecipe] = useState(false);
  const [copyRecipePopup, setCopyRecipePopup] = useState<RecipeProps | false>(
    false,
  );
  const [filteredRecipes, setFilteredRecipes] = useState<Array<RecipeProps>>(
    [],
  );
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [newRecipeName, setNewRecipeName] = useState<string>('');
  const [recipesSearcher, setRecipesSearcher] =
    useState<Searcher<RecipeProps, FullOptions<RecipeProps>>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <NavigationHeader
          {...props}
          headerRight={
            <TouchableOpacity
              style={styles.createNew}
              onPress={() =>
                navigation.navigate(Routes.RecipeDetails, {recipe: null})
              }>
              <FontAwesome5 size={15} color={'white'} name="plus" />
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (showSavedRecipeMessage) {
      setTimeout(() => {
        setShowSavedRecipeMessage(false);
      }, 2500);
    }
  }, [showSavedRecipeMessage]);

  useEffect(() => {
    setLoading(true);
    dispatch(getRecipes({}))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    const filteredList =
      recipesSearcher && recipes?.length && filterQuery?.length
        ? recipesSearcher.search(filterQuery)
        : recipes;
    setFilteredRecipes(filteredList);
  }, [filterQuery, recipesSearcher, recipes]);

  useEffect(() => {
    setFilteredRecipes(recipes);
    setRecipesSearcher(
      new Searcher(recipes, {
        keySelector: obj => obj.name,
        threshold: 1,
      }),
    );
  }, [recipes]);

  const handleOnPress = (item: RecipeProps) => {
    navigation.navigate(Routes.RecipeDetails, {recipe: item});
  };

  const loadMoreRecipes = () => {
    setLoading(true);
    dispatch(getRecipes({newOffset: limit + offset}))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleDeleteRecipe = (id: string) => {
    dispatch(deleteRecipe(id));
  };

  const startCopyRecipe = (recipe: RecipeProps) => {
    setCopyRecipePopup(recipe);
    setNewRecipeName(recipe.name);
  };

  const handleCopyRecipe = () => {
    const match = recipes.some(
      (item: RecipeProps) => item.name === newRecipeName,
    );
    if (
      !newRecipeName ||
      match ||
      newRecipeName === (copyRecipePopup as RecipeProps).name
    ) {
      dispatch(
        setInfoMessage({
          title: 'Error',
          text: 'Recipe name must be unique',
        }),
      );
    } else {
      setLoadingCopyRecipe(true);
      const clonedRecipeIndex = recipes.findIndex(
        item => item.id === (copyRecipePopup as RecipeProps).id,
      );
      const clonedRecipe: UpdateRecipeProps = _.cloneDeep(
        copyRecipePopup as RecipeProps,
      );
      delete clonedRecipe.created_at;
      delete clonedRecipe.updated_at;
      delete clonedRecipe.id;
      clonedRecipe.name = newRecipeName;
      dispatch(copyRecipe(clonedRecipe, clonedRecipeIndex))
        .then(() => {
          setCopyRecipePopup(false);
          setNewRecipeName('');
          setLoadingCopyRecipe(false);
        })
        .catch(() => {
          setLoadingCopyRecipe(false);
        });
    }
  };

  const quickLog = (recipe: RecipeProps) => {
    dispatch(basketActions.addRecipeToBasket(recipe.id)).then(
      (scaled_recipe: RecipeProps) => {
        dispatch(
          basketActions.mergeBasket({
            isSingleFood: true,
            recipeBrand: scaled_recipe.brand_name,
            servings: scaled_recipe.serving_qty.toString(),
            recipeName: scaled_recipe.name,
            customPhoto:
              !!scaled_recipe.photo && !!scaled_recipe.photo.highres
                ? {
                    full: scaled_recipe.photo.highres,
                    thumb: scaled_recipe.photo.thumb,
                    is_user_uploaded: false,
                  }
                : null,
          }),
        );
        navigation.replace(Routes.Basket);
      },
    );
  };

  return (
    <View style={styles.root}>
      <TextInput
        placeholder="Search my recipes"
        style={styles.inputQuery}
        value={filterQuery}
        onChangeText={text => setFilterQuery(text)}
      />
      <View style={styles.swipeContainer}>
        <Text style={styles.swipeText}>swipe left to delete</Text>
        {showSavedRecipeMessage && (
          <Text style={styles.saved}>Recipe Saved</Text>
        )}
      </View>
      {recipes.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {loading ? 'Loading. Please wait.' : 'You have no saved recipes.'}
          </Text>
        </View>
      )}
      <FlatList
        data={filteredRecipes}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Swipeable
            containerStyle={styles.swipeItemContainer}
            renderRightActions={() => (
              <SwipeHiddenButtons
                buttons={[
                  {
                    type: 'delete',
                    onPress: () => {
                      handleDeleteRecipe(item.id);
                    },
                  },
                  {
                    type: 'copy',
                    onPress: () => {
                      startCopyRecipe(item);
                      // close all swipes after copy
                      [...rowRefs.values()].forEach(ref => {
                        if (ref) {
                          ref.close();
                        }
                      });
                    },
                  },
                  {
                    type: 'log',
                    onPress: () => {
                      quickLog(item);
                    },
                  },
                ]}
              />
            )}
            ref={ref => {
              if (ref && !rowRefs.get(item.id)) {
                rowRefs.set(item.id, ref);
              }
            }}
            onSwipeableWillOpen={() => {
              [...rowRefs.entries()].forEach(([key, ref]) => {
                if (key !== item.id && ref) {
                  ref.close();
                }
              });
            }}>
            <MealListItem
              onTap={() => handleOnPress(item)}
              foodObj={item}
              recipe
              smallImage
              withCal
              withoutPhotoUploadIcon
              reverse
              withNewLabel
            />
          </Swipeable>
        )}
        onEndReached={() => {
          if (recipes.length <= limit + offset && showMore) {
            loadMoreRecipes();
          }
        }}
      />
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
    </View>
  );
};
