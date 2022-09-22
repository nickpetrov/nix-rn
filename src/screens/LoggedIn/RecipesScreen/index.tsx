// utils
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {FullOptions, Searcher} from 'fast-fuzzy';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// components
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// actions
import {getRecipes} from 'store/recipes/recipes.actions';

// styles
import {styles} from './RecipesScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {RecipeProps} from 'store/recipes/recipes.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface RecipesScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Recipes
  >;
}

export const RecipesScreen: React.FC<RecipesScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const recipes = useSelector(state => state.recipes.recipes);

  const [filteredRecipes, setFilteredRecipes] = useState<Array<RecipeProps>>(
    [],
  );
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [recipesSearcher, setRecipesSearcher] =
    useState<Searcher<RecipeProps, FullOptions<RecipeProps>>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Routes.RecipeDetails, {recipe: null})
          }>
          <FontAwesome5 size={26} color={'white'} name="plus" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    dispatch(getRecipes()).then(data => {
      setFilteredRecipes(data);
    });
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

  return (
    <View>
      <TextInput
        style={styles.inputQuery}
        value={filterQuery}
        onChangeText={text => setFilterQuery(text)}
      />
      <FlatList
        data={filteredRecipes}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableWithoutFeedback
            style={styles.row}
            onPress={() => handleOnPress(item)}>
            <View style={styles.recipeListItem}>
              <Image source={{uri: item.photo.thumb}} style={styles.image} />
              <Text>{item.name}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </View>
  );
};
