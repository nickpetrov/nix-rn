// utils
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {FullOptions, Searcher} from 'fast-fuzzy';
import moment from 'moment-timezone';

//helpers
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';

// components
import {View, Text, TouchableOpacity, Keyboard} from 'react-native';
import {FlatList, TextInput, Swipeable} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {NavigationHeader} from 'components/NavigationHeader';
import MealListItem from 'components/FoodLog/MealListItem';
import SwipeHiddenButtons from 'components/SwipeHiddenButtons';

// actions
import {
  deleteCustomFood,
  getCustomFoods,
} from 'store/customFoods/customFoods.actions';
import {addCustomFoodToBasket, mergeBasket} from 'store/basket/basket.actions';

// constants
import {Routes} from 'navigation/Routes';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// types
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps} from 'store/userLog/userLog.types';
import {RouteProp} from '@react-navigation/native';

// styles
import {styles} from './CustomFoodsScreen.styles';

interface CustomFoodsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.CustomFoods
  >;
  route: RouteProp<StackNavigatorParamList, Routes.CustomFoods>;
}

export const CustomFoodsScreen: React.FC<CustomFoodsScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showSavedFoodMessage, setShowSavedFoodMessage] = useState(false);
  const foods = useSelector(state => state.customFoods.foods);
  const emptyBasket = useSelector(state => state.basket.foods.length === 0);
  const [filteredFoods, setFilteredFoods] = useState<Array<FoodProps>>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [foodsSearcher, setFoodsSearcher] =
    useState<Searcher<FoodProps, FullOptions<FoodProps>>>();
  let rowRefs = new Map<string, Swipeable>();

  useEffect(() => {
    setShowSavedFoodMessage(!!route?.params?.showSavedFoodMessage);
  }, [route?.params?.showSavedFoodMessage]);

  useEffect(() => {
    if (showSavedFoodMessage) {
      setTimeout(() => {
        setShowSavedFoodMessage(false);
      }, 2500);
    }
  }, [showSavedFoodMessage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader
          {...props}
          navigation={navigation}
          headerRight={
            <TouchableOpacity
              style={styles.createNew}
              onPress={() => navigation.navigate(Routes.CustomFoodEdit)}>
              <FontAwesome5 size={15} color={'white'} name="plus" />
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    dispatch(getCustomFoods())
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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

  const handleDeleteRecipe = (id: string) => {
    dispatch(deleteCustomFood(id));
  };
  const quickLog = (item: FoodProps) => {
    if (emptyBasket) {
      dispatch(
        mergeBasket({
          meal_type: guessMealTypeByTime(moment().hours()),
        }),
      );
    }
    dispatch(addCustomFoodToBasket([item])).then(() => {
      navigation.replace(Routes.Basket);
    });
  };

  return (
    <View style={styles.root}>
      <TextInput
        placeholder="Search custom foods"
        style={styles.inputQuery}
        value={filterQuery}
        onChangeText={text => setFilterQuery(text)}
      />
      <View style={styles.swipeContainer}>
        <Text style={styles.swipeText}>swipe left to delete</Text>
        {showSavedFoodMessage && (
          <Text style={styles.saved}>Сustom food Saved</Text>
        )}
      </View>
      {foods.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {loading ? 'Loading. Please wait.' : 'You have no saved recipes.'}
          </Text>
        </View>
      )}
      <FlatList
        keyboardShouldPersistTaps="always"
        data={filteredFoods}
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
              onTap={() => {
                Keyboard.dismiss();
                handleOnPress(item);
              }}
              foodObj={item}
              withCal
              withoutPhotoUploadIcon
              reverse
            />
          </Swipeable>
        )}
      />
    </View>
  );
};
