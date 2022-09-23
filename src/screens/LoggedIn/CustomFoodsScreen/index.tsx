// utils
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {FullOptions, Searcher} from 'fast-fuzzy';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// actions
import {getCustomFoods} from 'store/customFoods/customFoods.actions';

// constants
import {Routes} from 'navigation/Routes';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps} from 'store/userLog/userLog.types';

// styles
import {styles} from './CustomFoodsScreen.styles';

interface CustomFoodsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.CustomFoods
  >;
}

export const CustomFoodsScreen: React.FC<CustomFoodsScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const foods = useSelector(state => state.customFoods.foods);
  const [filteredFoods, setFilteredFoods] = useState<Array<FoodProps>>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [foodsSearcher, setFoodsSearcher] =
    useState<Searcher<FoodProps, FullOptions<FoodProps>>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Routes.CustomFoodEdit, {food: null})
          }>
          <FontAwesome5 size={26} color={'white'} name="plus" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    dispatch(getCustomFoods());
  }, [dispatch]);

  useEffect(() => {
    setFilteredFoods(foods);
  }, [foods]);

  useEffect(() => {
    const filteredList =
      foodsSearcher && foods?.length && filterQuery?.length
        ? foodsSearcher.search(filterQuery)
        : foods;
    setFilteredFoods(filteredList);
  }, [filterQuery, foods, foodsSearcher]);

  useEffect(() => {
    setFilteredFoods(foods);
    setFoodsSearcher(
      new Searcher(foods, {
        keySelector: obj => obj.food_name,
        threshold: 1,
      }),
    );
  }, [foods]);

  const handleOnPress = (item: FoodProps) => {
    navigation.navigate(Routes.CustomFoodEdit, {food: item});
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={filterQuery}
        onChangeText={text => setFilterQuery(text)}
      />
      <FlatList
        data={filteredFoods}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableWithoutFeedback
            style={styles.itemContainer}
            onPress={() => handleOnPress(item)}>
            <View style={styles.foodListItem}>
              <Image source={{uri: item.photo.thumb}} style={styles.image} />
              <Text>{item.food_name}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </View>
  );
};
