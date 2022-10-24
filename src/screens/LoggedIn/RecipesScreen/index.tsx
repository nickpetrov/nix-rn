// utils
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {FullOptions, Searcher} from 'fast-fuzzy';

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

// actions
import {getRecipes, reset} from 'store/recipes/recipes.actions';

// styles
import {styles} from './RecipesScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {RecipeProps} from 'store/recipes/recipes.types';
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
  const [filteredRecipes, setFilteredRecipes] = useState<Array<RecipeProps>>(
    [],
  );
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [recipesSearcher, setRecipesSearcher] =
    useState<Searcher<RecipeProps, FullOptions<RecipeProps>>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <NavigationHeader
          {...props}
          headerRight={
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() =>
                navigation.navigate(Routes.RecipeDetails, {recipe: null})
              }>
              <FontAwesome5 size={26} color={'white'} name="plus" />
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    dispatch(getRecipes({}))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      }); /*.then(data => {
      setFilteredRecipes(data);
    });*/

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

  const deleteRecipe = (id: string) => {};
  const copyRecipe = (recipe: RecipeProps) => {};
  const quickLog = (recipe: RecipeProps) => {};

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
                      deleteRecipe(item.id);
                    },
                  },
                  {
                    type: 'copy',
                    onPress: () => {
                      copyRecipe(item);
                      // close all swipes after copy
                      [...rowRefs.values()].forEach(ref => {
                        if (ref) {
                          ref.close();
                        }
                      });
                      navigation.navigate(Routes.Basket);
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
    </View>
  );
};
